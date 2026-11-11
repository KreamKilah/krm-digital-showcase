import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { randomBytes } from 'node:crypto';
import { newSecret, encryptSecret, decryptSecret, totpForStep, matchTotp, normalizeRecovery } from '../src/mfa.mjs';
import { createApp } from '../src/app.mjs';
import { uuid, hashPassword, verifyPassword, normalizeEmail, parseCookies, COOKIE, safeHttpUrl, validatePassword } from '../src/security.mjs';

const base='http://127.0.0.1:39121';
const pass='VeryStrongPassphrase#2026';
let db,server,admin,clientA,clientB,projectA,projectB,authAdmin,authA,authB;
const qs=async(sql,params=[])=>db.query(sql,params);
function request(url,{method='GET',body,cookie,csrf,origin=base}={}){
 const headers={Accept:'application/json',Origin:origin};
 if(body!==undefined)headers['Content-Type']='application/json';
 if(cookie)headers.Cookie=cookie;
 if(csrf)headers['X-CSRF-Token']=csrf;
 return fetch(base+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual'});
}
async function parsed(res){return res.json()}
async function login(email,password=pass){
 const res=await request('/api/login',{method:'POST',body:{email,password}});
 const data=await parsed(res);assert.equal(res.status,200,JSON.stringify(data));
 const cookie=res.headers.get('set-cookie').split(';')[0];
 assert.ok(cookie.startsWith(COOKIE+'='));
 assert.ok(res.headers.get('set-cookie').includes('Secure; SameSite=Strict'));
 return {cookie,csrf:data.csrf,user:data.user};
}
async function mutate(url,auth,body,method='POST'){
 return request(url,{method,cookie:auth.cookie,csrf:auth.csrf,body});
}
before(async()=>{
 process.env.MFA_ENCRYPTION_KEY=randomBytes(32).toString('base64url');
 db=new pg.Pool({connectionString:process.env.DATABASE_URL,max:8});
 await qs('TRUNCATE TABLE audit_events,login_failures,invitations,approvals,comments,milestones,project_members,projects,sessions,users RESTART IDENTITY CASCADE');
 admin=uuid();clientA=uuid();clientB=uuid();projectA=uuid();projectB=uuid();
 const hashed=await hashPassword(pass);
 for(const [id,email,name,role] of [[admin,'owner@example.test','KRM Owner','admin'],[clientA,'alpha@example.test','Alpha Client','client'],[clientB,'beta@example.test','Beta Client','client']]){
  await qs('INSERT INTO users(id,email,display_name,role,password_hash) VALUES($1,$2,$3,$4,$5)',[id,email,name,role,hashed]);
 }
 await qs('INSERT INTO projects(id,title,summary,stage,progress) VALUES($1,$2,$3,$4,$5),($6,$7,$8,$9,$10)',[projectA,'Alpha Website','Confidential Alpha','design',30,projectB,'Beta Website','Confidential Beta','review',75]);
 await qs('INSERT INTO project_members(project_id,user_id) VALUES($1,$2),($3,$4)',[projectA,clientA,projectB,clientB]);
 server=createApp(db,{origin:base,production:false}).listen(39121,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 authAdmin=await login('owner@example.test');authA=await login('alpha@example.test');authB=await login('beta@example.test');
});
after(async()=>{if(server)await new Promise(resolve=>server.close(resolve));if(db)await db.end()});

test('password hashes are salted and verified, unknown and malformed rejected',async()=>{
 const a=await hashPassword('A very long passphrase 1234!');
 const b=await hashPassword('A very long passphrase 1234!');
 assert.notEqual(a,b);assert.equal(await verifyPassword('A very long passphrase 1234!',a),true);
 assert.equal(await verifyPassword('wrong',a),false);assert.equal(await verifyPassword('wrong','scrypt$bad$abc'),false);
 assert.equal(normalizeEmail('  TEST@EXAMPLE.ORG '),'test@example.org');
 assert.equal(validatePassword('short'),false);
 assert.equal(safeHttpUrl('javascript:alert(1)'),null);
 assert.equal(safeHttpUrl('http://example.com'),null);
});
test('sessions are secured in hashed form, not raw token',async()=>{
 const token=authA.cookie.split('=')[1];
 const rows=await qs('SELECT token_hash FROM sessions WHERE user_id=$1',[clientA]);
 assert.equal(rows.rowCount,1);
 assert.ok(!rows.rows[0].token_hash.includes(token));
 assert.equal(await verifyPassword('random','scrypt$bad$invalid'),false);
 const r=await request('/api/me',{cookie:authA.cookie});
 assert.equal(r.status,200);
 const body=await parsed(r);assert.equal(body.user.role,'client');
});
test('tenants only see assigned projects, project IDs do not bypass membership',async()=>{
 const a=await request('/api/projects',{cookie:authA.cookie});
 const data=await parsed(a);assert.deepEqual(data.projects.map(p=>p.title),['Alpha Website']);
 const b=await request('/api/projects/'+projectB,{cookie:authA.cookie});
 assert.equal(b.status,404);
 const c=await request('/api/projects/'+projectA,{cookie:authB.cookie});
 assert.equal(c.status,404);
 const all=await request('/api/projects',{cookie:authAdmin.cookie});
 assert.equal((await parsed(all)).projects.length,2);
});
test('wrong origin and missing CSRF block writes, client cannot call admin endpoints',async()=>{
 const noCsrf=await request('/api/projects/'+projectA+'/comments',{method:'POST',body:{body:'Hello'},cookie:authA.cookie});
 assert.equal(noCsrf.status,403);
 const wrong=await request('/api/projects/'+projectA+'/comments',{method:'POST',body:{body:'Hello'},cookie:authA.cookie,csrf:authA.csrf,origin:'https://attacker.invalid'});
 assert.equal(wrong.status,403);
 const adminDenied=await mutate('/api/admin/projects',authA,{title:'Attack',summary:''});
 assert.equal(adminDenied.status,403);
});
test('client comments are constrained to membership even with valid CSRF',async()=>{
 const other=await mutate('/api/projects/'+projectB+'/comments',authA,{body:'Do not leak'});
 assert.equal(other.status,404);
 const own=await mutate('/api/projects/'+projectA+'/comments',authA,{body:'<img src=x onerror=alert(1)> A alteração é necessária'});
 assert.equal(own.status,201);
 const ownDetail=await request('/api/projects/'+projectA,{cookie:authA.cookie});
 assert.equal((await parsed(ownDetail)).comments.length,1);
 const otherDetail=await request('/api/projects/'+projectB,{cookie:authB.cookie});
 assert.equal((await parsed(otherDetail)).comments.length,0);
});
test('admin can create milestone and approval; another client cannot approve cross-tenant',async()=>{
 const m=await mutate('/api/admin/projects/'+projectA+'/milestones',authAdmin,{title:'New design',status:'active',position:1});
 assert.equal(m.status,201);
 const r=await mutate('/api/admin/projects/'+projectA+'/approvals',authAdmin,{version:'Design V2'});
 assert.equal(r.status,201);const approvalId=(await parsed(r)).id;
 const other=await mutate('/api/projects/'+projectA+'/approvals/'+approvalId+'/decision',authB,{decision:'approved'});
 assert.equal(other.status,404);
 const own=await mutate('/api/projects/'+projectA+'/approvals/'+approvalId+'/decision',authA,{decision:'changes_requested'});
 assert.equal(own.status,200);
 const replay=await mutate('/api/projects/'+projectA+'/approvals/'+approvalId+'/decision',authA,{decision:'approved'});
 assert.equal(replay.status,409);
 const data=await parsed(await request('/api/projects/'+projectA,{cookie:authA.cookie}));
 assert.equal(data.approvals[0].status,'changes_requested');
});
test('admin issues expiring one-use project invitation; client activation scoped',async()=>{
 const inv=await mutate('/api/admin/projects/'+projectA+'/invites',authAdmin,{email:'newclient@example.test'});
 assert.equal(inv.status,201);const data=await parsed(inv);
 assert.ok(data.inviteUrl.includes('/#invite='));
 const token=data.inviteUrl.split('#invite=')[1];
 const accept=await request('/api/invites/accept',{method:'POST',body:{token,name:'New Client',password:'NewClientSecretPass!2026'}});
 assert.equal(accept.status,201);
 const again=await request('/api/invites/accept',{method:'POST',body:{token,name:'Another',password:'NewClientSecretPass!2026'}});
 assert.equal(again.status,404);
 const newAuth=await login('newclient@example.test','NewClientSecretPass!2026');
 const projectsRes=await request('/api/projects',{cookie:newAuth.cookie});
 assert.deepEqual((await parsed(projectsRes)).projects.map(p=>p.title),['Alpha Website']);
});

test('admin can inspect client access but ordinary clients cannot enumerate project users',async()=>{
 const adminView=await request('/api/admin/projects/'+projectB+'/access',{cookie:authAdmin.cookie});
 assert.equal(adminView.status,200);
 const body=await parsed(adminView);
 assert.deepEqual(body.members.map(u=>u.email),['beta@example.test']);
 assert.ok(Array.isArray(body.pendingInvitations));
 const blocked=await request('/api/admin/projects/'+projectB+'/access',{cookie:authA.cookie});
 assert.equal(blocked.status,403);
});
test('admin revokes project membership instantly, then can reassign same client',async()=>{
 const unauthorized=await mutate('/api/admin/projects/'+projectB+'/members/'+clientB,authB,{},'DELETE');
 assert.equal(unauthorized.status,403);
 const revocation=await mutate('/api/admin/projects/'+projectB+'/members/'+clientB,authAdmin,{},'DELETE');
 assert.equal(revocation.status,200);
 assert.equal((await request('/api/projects/'+projectB,{cookie:authB.cookie})).status,404);
 const own=await parsed(await request('/api/projects',{cookie:authB.cookie}));
 assert.deepEqual(own.projects,[]);
 assert.equal((await mutate('/api/projects/'+projectB+'/comments',authB,{body:'Must stay excluded'})).status,404);
 const restored=await mutate('/api/admin/projects/'+projectB+'/members',authAdmin,{email:'beta@example.test'});
 assert.equal(restored.status,201);
 assert.equal((await request('/api/projects/'+projectB,{cookie:authB.cookie})).status,200);
});
test('admin can revoke an outstanding invitation; revoked URL cannot register',async()=>{
 const email='cancelled@example.test';
 const invite=await mutate('/api/admin/projects/'+projectB+'/invites',authAdmin,{email});
 assert.equal(invite.status,201);
 const token=(await parsed(invite)).inviteUrl.split('#invite=')[1];
 const access=await parsed(await request('/api/admin/projects/'+projectB+'/access',{cookie:authAdmin.cookie}));
 assert.ok(access.pendingInvitations.some(p=>p.email===email));
 const revoke=await mutate('/api/admin/projects/'+projectB+'/invitations',authAdmin,{email},'DELETE');
 assert.equal(revoke.status,200);
 const accept=await request('/api/invites/accept',{method:'POST',body:{token,name:'Cancelled Person',password:'ExampleSecretPassphrase2026!'}});
 assert.equal(accept.status,404);
});
test('disabling a client revokes sessions and blocks login, then allows reactivation',async()=>{
 const noAdmin=await mutate('/api/admin/clients/'+clientB+'/status',authB,{active:false});
 assert.equal(noAdmin.status,403);
 const cannotDisableAdmin=await mutate('/api/admin/clients/'+admin+'/status',authAdmin,{active:false});
 assert.equal(cannotDisableAdmin.status,404);
 const disabled=await mutate('/api/admin/clients/'+clientB+'/status',authAdmin,{active:false});
 assert.equal(disabled.status,200);
 assert.equal((await request('/api/me',{cookie:authB.cookie})).status,401);
 const deniedLogin=await request('/api/login',{method:'POST',body:{email:'beta@example.test',password:pass}});
 assert.equal(deniedLogin.status,401);
 const enabled=await mutate('/api/admin/clients/'+clientB+'/status',authAdmin,{active:true});
 assert.equal(enabled.status,200);
 authB=await login('beta@example.test');
 assert.equal((await request('/api/projects/'+projectB,{cookie:authB.cookie})).status,200);
});

test('logout revokes server-side session immediately',async()=>{
 const res=await mutate('/api/logout',authA,{});
 assert.equal(res.status,200);
 const attempt=await request('/api/me',{cookie:authA.cookie});assert.equal(attempt.status,401);
 const still=await request('/api/me',{cookie:authB.cookie});assert.equal(still.status,200);
});

test('authenticated user can revoke all active sessions including the current one',async()=>{
 const response=await mutate('/api/me/sessions/revoke-all',authB,{});
 assert.equal(response.status,200);
 assert.equal((await request('/api/me',{cookie:authB.cookie})).status,401);
 authB=await login('beta@example.test');
 assert.equal((await request('/api/me',{cookie:authB.cookie})).status,200);
});


test('password change requires current credentials and revokes all previous sessions',async()=>{
 const newPass='AnEvenStrongerPassphrase!2030';
 const wrong=await mutate('/api/me/password',authB,{currentPassword:'not the real pass',newPassword:newPass});
 assert.equal(wrong.status,403);
 const weak=await mutate('/api/me/password',authB,{currentPassword:pass,newPassword:'123456'});
 assert.equal(weak.status,400);
 const done=await mutate('/api/me/password',authB,{currentPassword:pass,newPassword:newPass});
 assert.equal(done.status,200);
 assert.equal((await request('/api/me',{cookie:authB.cookie})).status,401);
 assert.equal((await request('/api/login',{method:'POST',body:{email:'beta@example.test',password:pass}})).status,401);
 authB=await login('beta@example.test',newPass);
 assert.equal((await request('/api/projects/'+projectB,{cookie:authB.cookie})).status,200);
});


test('encrypted TOTP secrets use unique nonces, reject tampering and enforce code replay policy',async()=>{
 const secret=newSecret(),a=encryptSecret(secret),b=encryptSecret(secret);
 assert.notEqual(a,b);assert.deepEqual(decryptSecret(a),secret);
 const parts=a.split('.');parts[2]=(parts[2][0]==='A'?'B':'A')+parts[2].slice(1);
 assert.throws(()=>decryptSecret(parts.join('.')));
 const now=Date.now(),step=Math.floor(now/30000),code=totpForStep(secret,step);
 assert.equal(matchTotp(secret,code,{now,lastStep:step}),null);
 assert.equal(matchTotp(secret,code,{now,lastStep:step-1}),step);
});

test('MFA enrollment encrypts secret and enforces a second factor before admin login',async()=>{
 const owner=uuid(),email='mfaowner@example.test';
 await qs("INSERT INTO users(id,email,display_name,role,password_hash) VALUES($1,$2,$3,'admin',$4)",[owner,email,'MFA owner',await hashPassword(pass)]);
 const initial=await login(email);
 const wrong=await mutate('/api/me/mfa/setup',initial,{currentPassword:'not the password'});
 assert.equal(wrong.status,403);
 const setup=await mutate('/api/me/mfa/setup',initial,{currentPassword:pass});
 assert.equal(setup.status,200);const details=await parsed(setup);
 assert.match(details.secret,/^[A-Z2-7]{32}$/);
 assert.match(details.otpauthUri,/^otpauth:\/\/totp\//);
 const dbFactor=await qs('SELECT secret_ciphertext,enabled FROM mfa_factors WHERE user_id=$1',[owner]);
 assert.equal(dbFactor.rows[0].enabled,false);
 assert.ok(!dbFactor.rows[0].secret_ciphertext.includes(details.secret));
 const secret=decryptSecret(dbFactor.rows[0].secret_ciphertext),currentStep=Math.floor(Date.now()/30000);
 const first=totpForStep(secret,currentStep);
 assert.equal(matchTotp(secret,first,{now:Date.now(),lastStep:-1}),currentStep);
 const confirm=await mutate('/api/me/mfa/confirm',initial,{code:first});
 assert.equal(confirm.status,200);
 const confirmed=await parsed(confirm);
 assert.equal(confirmed.reauthenticate,true);assert.equal(confirmed.recoveryCodes.length,8);
 assert.equal((await request('/api/me',{cookie:initial.cookie})).status,401);
 const loginResponse=await request('/api/login',{method:'POST',body:{email,password:pass}});
 assert.equal(loginResponse.status,200);
 const challenge=(await parsed(loginResponse));assert.equal(challenge.mfaRequired,true);
 assert.ok(!loginResponse.headers.get('set-cookie'));
 const invalid=await request('/api/login/mfa',{method:'POST',body:{challengeToken:challenge.challengeToken,code:'123'}});
 assert.equal(invalid.status,400);
 const next=totpForStep(secret,currentStep+1);
 const verified=await request('/api/login/mfa',{method:'POST',body:{challengeToken:challenge.challengeToken,code:next}});
 assert.equal(verified.status,200);
 const auth=(await parsed(verified));assert.equal(auth.user.email,email);assert.equal(auth.user.role,'admin');
 const mfaCookie=verified.headers.get('set-cookie').split(';')[0];
 assert.equal((await request('/api/me',{cookie:mfaCookie})).status,200);
 const secondLogin=await request('/api/login',{method:'POST',body:{email,password:pass}});
 const secondChallenge=(await parsed(secondLogin)).challengeToken;
 const replay=await request('/api/login/mfa',{method:'POST',body:{challengeToken:secondChallenge,code:next}});
 assert.equal(replay.status,401);
 const code=confirmed.recoveryCodes[0];
 assert.ok(normalizeRecovery(code));
 const recovered=await request('/api/login/mfa',{method:'POST',body:{challengeToken:secondChallenge,code}});
 assert.equal(recovered.status,200);
 const remaining=await qs('SELECT count(*)::int AS n FROM mfa_recovery_codes WHERE user_id=$1',[owner]);
 assert.equal(remaining.rows[0].n,7);
 const thirdLogin=await request('/api/login',{method:'POST',body:{email,password:pass}});
 const thirdChallenge=(await parsed(thirdLogin)).challengeToken;
 const reuse=await request('/api/login/mfa',{method:'POST',body:{challengeToken:thirdChallenge,code}});
 assert.equal(reuse.status,401);
 const fourth=await request('/api/login',{method:'POST',body:{email,password:pass}});
 const limited=(await parsed(fourth)).challengeToken;
 const candidates=[currentStep-1,currentStep,currentStep+1].filter(n=>n>=0).map(step=>totpForStep(secret,step));
 let wrongCode='222222';while(candidates.includes(wrongCode))wrongCode=String((Number(wrongCode)+111111)%1000000).padStart(6,'0');
 const wrongOrigin=await request('/api/login/mfa',{method:'POST',body:{challengeToken:limited,code:wrongCode},origin:'https://other.invalid'});
 assert.equal(wrongOrigin.status,403);
 for(let i=0;i<5;i++){
  const wrong=await request('/api/login/mfa',{method:'POST',body:{challengeToken:limited,code:wrongCode}});
  assert.equal(wrong.status,401);
 }
 const exhausted=await request('/api/login/mfa',{method:'POST',body:{challengeToken:limited,code:confirmed.recoveryCodes[1]}});
 assert.equal(exhausted.status,401);
});

test('launch gate is closed by default in production mode',async()=>{
 const closed=createApp(db,{origin:'https://clients.example.test',production:true});
 const temporary=closed.listen(39122,'127.0.0.1');await new Promise(r=>temporary.once('listening',r));
 try{
  const r=await fetch('http://127.0.0.1:39122/',{redirect:'manual'});
  assert.equal(r.status,503);
 }finally{await new Promise(r=>temporary.close(r))}
});
