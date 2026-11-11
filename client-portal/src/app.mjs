import express from 'express';
import pg from 'pg';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { uuid, opaque, digest, normalizeEmail, validatePassword, hashPassword, verifyPassword, constantTokenMatch, parseCookies, sessionCookie, COOKIE, safeHttpUrl, validId } from './security.mjs';
import {newSecret,base32,encryptSecret,decryptSecret,matchTotp,enrollmentUri,recoveryCodes,normalizeRecovery} from './mfa.mjs';

const SESSION_MS=8*60*60*1000;
const appDir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../public');
const asyncRoute=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
const validText=(value,max=2000,min=1)=>typeof value==='string' && value.trim().length>=min && value.trim().length<=max;
const give=(res,status,error)=>res.status(status).json({error});
const stageValues=new Set(['briefing','design','development','review','delivered']);
const milestoneValues=new Set(['planned','active','done']);

export function createApp(db,{origin=process.env.APP_ORIGIN||'http://localhost:3000',production=process.env.NODE_ENV==='production'}={}){
 if(production&&(!origin.startsWith('https://')||origin.includes('YOUR_')))throw Error('APP_ORIGIN must be the production HTTPS origin');
 const app=express();
 app.disable('x-powered-by');
 app.set('trust proxy',1);
 app.use((req,res,next)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; font-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
  if(production)res.setHeader('Strict-Transport-Security','max-age=63072000; includeSubDomains');
  if(req.path.startsWith('/api'))res.setHeader('Cache-Control','no-store');
  next();
 });
 app.use(express.json({limit:'16kb',type:'application/json'}));
 app.get('/healthz',asyncRoute(async(req,res)=>{
  await db.query('SELECT 1');res.json({ok:true});
 }));
 if(production&&process.env.LAUNCH_ENABLED!=='true'){
  app.use((req,res)=>give(res,503,'Portal in private staging; not launched'));
  return app;
 }
 // All writes including unauthenticated login use a strict same-origin gate.
 function sameOrigin(req,res,next){
  if(req.get('Origin')!==origin)return give(res,403,'Origin not permitted');
  next();
 }
 const dummyHashPromise=hashPassword('dummy-password-always-invalid-9881');
 async function auth(req,res,next){
  const token=parseCookies(req.headers.cookie||'')[COOKIE];
  if(typeof token!=='string'||!(/^[a-zA-Z0-9_-]{35,70}$/.test(token)))return give(res,401,'Authentication required');
  const result=await db.query(
   'SELECT s.token_hash,s.csrf_token,s.expires_at,u.id,u.email,u.display_name,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now() AND u.active=TRUE',
   [digest(token)]
  );
  if(result.rowCount!==1)return give(res,401,'Authentication required');
  req.auth=result.rows[0];next();
 }
 const authed=asyncRoute(auth);
 function csrf(req,res,next){
  if(!constantTokenMatch(req.get('X-CSRF-Token')||'',req.auth.csrf_token))return give(res,403,'CSRF token invalid');
  next();
 }
 const admin=(req,res,next)=>req.auth.role==='admin'?next():give(res,403,'Admin access required');
 async function allowed(req,projectId){
  if(!validId(projectId))return false;
  if(req.auth.role==='admin')return true;
  const r=await db.query('SELECT 1 FROM project_members WHERE project_id=$1 AND user_id=$2',[projectId,req.auth.id]);
  return r.rowCount>0;
 }
 async function audit(actor,projectId,event,details={}){
  await db.query('INSERT INTO audit_events(id,actor_id,project_id,event,details) VALUES($1,$2,$3,$4,$5)',
    [uuid(),actor,projectId,event,JSON.stringify(details)]);
 }
 function requireId(req,res,next){if(!validId(req.params.id))return give(res,400,'Invalid project id');next()}
 async function failCount(key){
  const r=await db.query("SELECT count(*)::int AS n FROM login_failures WHERE key=$1 AND happened_at>now()-interval '15 minutes'",[key]);
  return r.rows[0].n;
 }
 async function failure(key1,key2){
  await db.query('INSERT INTO login_failures(key) VALUES($1),($2)',[key1,key2]);
 }
 app.post('/api/login',sameOrigin,asyncRoute(async(req,res)=>{
  const email=normalizeEmail(req.body?.email),password=req.body?.password;
  if(!email||typeof password!=='string'||password.length>256)return give(res,400,'Invalid credentials');
  const byEmail='email:'+digest(email),byIp='ip:'+digest(req.ip||'unknown');
  if((await failCount(byEmail))>=8||(await failCount(byIp))>=35)return give(res,429,'Too many attempts; retry later');
  const q=await db.query("SELECT u.id,u.email,u.display_name,u.role,u.password_hash,COALESCE(f.enabled,FALSE) AS mfa_enabled FROM users u LEFT JOIN mfa_factors f ON f.user_id=u.id WHERE u.email=$1 AND u.active=TRUE",[email]);
  const u=q.rows[0];const valid=await verifyPassword(password,u?.password_hash||await dummyHashPromise);
  if(!u||!valid){await failure(byEmail,byIp);return give(res,401,'Invalid credentials')}
  if(u.mfa_enabled){
   const challenge=opaque();
   await db.query("INSERT INTO mfa_challenges(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[digest(challenge),u.id]);
   return res.json({mfaRequired:true,challengeToken:challenge,expiresMinutes:5});
  }
  const token=opaque(),csrfToken=opaque();
  await db.query('INSERT INTO sessions(token_hash,user_id,csrf_token,expires_at) VALUES($1,$2,$3,$4)',[digest(token),u.id,csrfToken,new Date(Date.now()+SESSION_MS)]);
  res.setHeader('Set-Cookie',sessionCookie(token));
  res.json({user:{id:u.id,email:u.email,name:u.display_name,role:u.role},csrf:csrfToken});
 }));

 // MFA challenge: the password alone never yields a session for enrolled accounts.
 app.post('/api/login/mfa',sameOrigin,asyncRoute(async(req,res)=>{
  const challenge=req.body?.challengeToken,code=req.body?.code;
  const recovery=normalizeRecovery(code);
  if(typeof challenge!=='string'||!/^[A-Za-z0-9_-]{35,70}$/.test(challenge)||(!/^\d{6}$/.test(code||'')&&!recovery))return give(res,400,'Invalid MFA challenge');
  const tx=await db.connect();
  try{
   await tx.query('BEGIN');
   const result=await tx.query("SELECT c.user_id,c.attempts,u.email,u.display_name,u.role,f.secret_ciphertext,f.last_time_step FROM mfa_challenges c JOIN users u ON u.id=c.user_id JOIN mfa_factors f ON f.user_id=u.id WHERE c.token_hash=$1 AND c.expires_at>now() AND c.attempts<5 AND u.active=TRUE AND f.enabled=TRUE FOR UPDATE OF c,f",[digest(challenge)]);
   if(!result.rowCount){await tx.query('ROLLBACK');return give(res,401,'MFA challenge expired or invalid')}
   const u=result.rows[0],mfaKey='mfa:'+digest(u.user_id),ipKey='mfa-ip:'+digest(req.ip||'unknown');
   if((await failCount(mfaKey))>=10||(await failCount(ipKey))>=35){await tx.query('ROLLBACK');return give(res,429,'Too many attempts; retry later')}
   let step=null,passed=false;
   if(recovery){
    const consumed=await tx.query('DELETE FROM mfa_recovery_codes WHERE user_id=$1 AND code_hash=$2 RETURNING code_hash',[u.user_id,digest(recovery)]);
    passed=consumed.rowCount===1;
   }else{
    step=matchTotp(decryptSecret(u.secret_ciphertext),code,{lastStep:u.last_time_step});
    passed=step!==null;
   }
   if(!passed){
    await tx.query('UPDATE mfa_challenges SET attempts=attempts+1 WHERE token_hash=$1',[digest(challenge)]);
    await tx.query('INSERT INTO login_failures(key) VALUES($1),($2)',[mfaKey,ipKey]);
    await tx.query('COMMIT');return give(res,401,'Invalid verification code');
   }
   if(step!==null)await tx.query('UPDATE mfa_factors SET last_time_step=$1 WHERE user_id=$2',[step,u.user_id]);
   await tx.query('DELETE FROM mfa_challenges WHERE token_hash=$1',[digest(challenge)]);
   const token=opaque(),csrfToken=opaque();
   await tx.query('INSERT INTO sessions(token_hash,user_id,csrf_token,expires_at) VALUES($1,$2,$3,$4)',[digest(token),u.user_id,csrfToken,new Date(Date.now()+SESSION_MS)]);
   await tx.query('COMMIT');
   res.setHeader('Set-Cookie',sessionCookie(token));
   res.json({user:{id:u.user_id,email:u.email,name:u.display_name,role:u.role},csrf:csrfToken});
  }catch(e){await tx.query('ROLLBACK');throw e}finally{tx.release()}
 }));

 app.post('/api/invites/accept',sameOrigin,asyncRoute(async(req,res)=>{
  const token=req.body?.token,name=req.body?.name,password=req.body?.password;
  if(typeof token!=='string'||token.length<30||token.length>100||!validText(name,120)||!validatePassword(password))return give(res,400,'Invalid invitation details');
  const client=await db.connect();
  try{
   await client.query('BEGIN');
   const r=await client.query('SELECT project_id,email FROM invitations WHERE token_hash=$1 AND accepted_at IS NULL AND expires_at>now() FOR UPDATE',[digest(token)]);
   if(r.rowCount!==1){await client.query('ROLLBACK');return give(res,404,'Invitation unavailable')}
   const invite=r.rows[0];
   const u=await client.query('SELECT id FROM users WHERE email=$1',[invite.email]);
   if(u.rowCount){await client.query('ROLLBACK');return give(res,409,'Account already exists; request admin assignment')}
   const id=uuid();
   await client.query("INSERT INTO users(id,email,display_name,role,password_hash) VALUES($1,$2,$3,'client',$4)",
     [id,invite.email,name.trim(),await hashPassword(password)]);
   await client.query('INSERT INTO project_members(project_id,user_id) VALUES($1,$2)',[invite.project_id,id]);
   await client.query('UPDATE invitations SET accepted_at=now() WHERE token_hash=$1',[digest(token)]);
   await client.query('INSERT INTO audit_events(id,actor_id,project_id,event,details) VALUES($1,$2,$3,$4,$5)',
     [uuid(),id,invite.project_id,'invite_accepted',JSON.stringify({email:invite.email})]);
   await client.query('COMMIT');res.status(201).json({ok:true,message:'Account created. Please log in.'});
  }catch(e){await client.query('ROLLBACK');throw e}finally{client.release()}
 }));

 // TOTP enrolment requires re-entering the current password; no external QR provider is used.
 app.get('/api/me/mfa',authed,asyncRoute(async(req,res)=>{
  const f=await db.query('SELECT enabled FROM mfa_factors WHERE user_id=$1',[req.auth.id]);
  const codes=await db.query('SELECT count(*)::int AS n FROM mfa_recovery_codes WHERE user_id=$1',[req.auth.id]);
  res.json({enabled:f.rows[0]?.enabled===true,recoveryCodesRemaining:codes.rows[0].n});
 }));
 app.post('/api/me/mfa/setup',sameOrigin,authed,csrf,asyncRoute(async(req,res)=>{
  const password=req.body?.currentPassword;
  if(typeof password!=='string')return give(res,400,'Current password required');
  const reauthKey='mfa-setup:'+digest(req.auth.id);
  if((await failCount(reauthKey))>=6)return give(res,429,'Too many attempts; retry later');
  const person=await db.query('SELECT password_hash FROM users WHERE id=$1 AND active=TRUE',[req.auth.id]);
  if(!person.rowCount||!await verifyPassword(password,person.rows[0].password_hash)){
   await db.query('INSERT INTO login_failures(key) VALUES($1)',[reauthKey]);
   return give(res,403,'Current password incorrect');
  }
  const existing=await db.query('SELECT enabled FROM mfa_factors WHERE user_id=$1',[req.auth.id]);
  if(existing.rows[0]?.enabled)return give(res,409,'MFA already enabled');
  const secret=newSecret();
  const written=await db.query('INSERT INTO mfa_factors(user_id,secret_ciphertext,enabled,last_time_step) VALUES($1,$2,FALSE,-1) ON CONFLICT(user_id) DO UPDATE SET secret_ciphertext=EXCLUDED.secret_ciphertext,enabled=FALSE,last_time_step=-1 WHERE mfa_factors.enabled=FALSE RETURNING user_id',[req.auth.id,encryptSecret(secret)]);
  if(!written.rowCount)return give(res,409,'MFA already enabled');
  await db.query('DELETE FROM mfa_recovery_codes WHERE user_id=$1',[req.auth.id]);
  await audit(req.auth.id,null,'mfa_enrollment_started');
  res.json({secret:base32(secret),otpauthUri:enrollmentUri(req.auth.email,secret),instructions:'Use an offline authenticator app and verify the code.'});
 }));
 app.post('/api/me/mfa/confirm',sameOrigin,authed,csrf,asyncRoute(async(req,res)=>{
  const code=req.body?.code;
  if(typeof code!=='string'||!/^\d{6}$/.test(code))return give(res,400,'Six-digit code required');
  const verifyKey='mfa-confirm:'+digest(req.auth.id);
  if((await failCount(verifyKey))>=8)return give(res,429,'Too many attempts; retry later');
  const tx=await db.connect();
  try{
   await tx.query('BEGIN');
   const q=await tx.query('SELECT secret_ciphertext,enabled,last_time_step FROM mfa_factors WHERE user_id=$1 FOR UPDATE',[req.auth.id]);
   if(!q.rowCount||q.rows[0].enabled){await tx.query('ROLLBACK');return give(res,409,'MFA not in setup')}
   const step=matchTotp(decryptSecret(q.rows[0].secret_ciphertext),code,{lastStep:q.rows[0].last_time_step});
   if(step===null){
    await tx.query('INSERT INTO login_failures(key) VALUES($1)',[verifyKey]);
    await tx.query('COMMIT');return give(res,403,'Invalid verification code')
   }
   const codes=recoveryCodes(8);
   await tx.query('UPDATE mfa_factors SET enabled=TRUE,last_time_step=$1,enabled_at=now() WHERE user_id=$2',[step,req.auth.id]);
   await tx.query('DELETE FROM mfa_recovery_codes WHERE user_id=$1',[req.auth.id]);
   for(const c of codes)await tx.query('INSERT INTO mfa_recovery_codes(user_id,code_hash) VALUES($1,$2)',[req.auth.id,c.hash]);
   await tx.query('DELETE FROM sessions WHERE user_id=$1',[req.auth.id]);
   await tx.query('DELETE FROM mfa_challenges WHERE user_id=$1',[req.auth.id]);
   await tx.query('INSERT INTO audit_events(id,actor_id,event) VALUES($1,$2,$3)',[uuid(),req.auth.id,'mfa_enabled']);
   await tx.query('COMMIT');
   res.setHeader('Set-Cookie',sessionCookie('',0));
   res.json({ok:true,reauthenticate:true,recoveryCodes:codes.map(c=>c.display)});
  }catch(e){await tx.query('ROLLBACK');throw e}finally{tx.release()}
 }));

 app.get('/api/me',authed,(req,res)=>{
  const u=req.auth;
  res.json({user:{id:u.id,email:u.email,name:u.display_name,role:u.role},csrf:u.csrf_token});
 });
 app.post('/api/logout',sameOrigin,authed,csrf,asyncRoute(async(req,res)=>{
  await db.query('DELETE FROM sessions WHERE token_hash=$1',[req.auth.token_hash]);
  res.setHeader('Set-Cookie',sessionCookie('',0));res.json({ok:true});
 }));
 app.get('/api/projects',authed,asyncRoute(async(req,res)=>{
  const q=req.auth.role==='admin'
   ? await db.query('SELECT id,title,summary,stage,progress,preview_url,created_at FROM projects ORDER BY created_at DESC LIMIT 100')
   : await db.query('SELECT p.id,p.title,p.summary,p.stage,p.progress,p.preview_url,p.created_at FROM projects p JOIN project_members m ON m.project_id=p.id WHERE m.user_id=$1 ORDER BY p.created_at DESC LIMIT 100',[req.auth.id]);
  res.json({projects:q.rows});
 }));
 app.get('/api/projects/:id',authed,requireId,asyncRoute(async(req,res)=>{
  if(!await allowed(req,req.params.id))return give(res,404,'Project not found');
  const r=await db.query('SELECT id,title,summary,stage,progress,preview_url,created_at FROM projects WHERE id=$1',[req.params.id]);
  if(!r.rowCount)return give(res,404,'Project not found');
  const [milestones,comments,approvals]=await Promise.all([
   db.query('SELECT id,title,status,position,created_at FROM milestones WHERE project_id=$1 ORDER BY position,created_at',[req.params.id]),
   db.query('SELECT c.id,c.body,c.created_at,u.display_name AS author FROM comments c JOIN users u ON u.id=c.author_id WHERE c.project_id=$1 ORDER BY c.created_at ASC LIMIT 200',[req.params.id]),
   db.query('SELECT id,version_label,status,decided_at,created_at FROM approvals WHERE project_id=$1 ORDER BY created_at DESC LIMIT 50',[req.params.id])
  ]);
  res.json({project:r.rows[0],milestones:milestones.rows,comments:comments.rows,approvals:approvals.rows});
 }));
 app.post('/api/projects/:id/comments',sameOrigin,authed,csrf,requireId,asyncRoute(async(req,res)=>{
  if(!await allowed(req,req.params.id))return give(res,404,'Project not found');
  if(!validText(req.body?.body,2000))return give(res,400,'Comment must contain 1-2000 characters');
  const id=uuid();
  await db.query('INSERT INTO comments(id,project_id,author_id,body) VALUES($1,$2,$3,$4)',[id,req.params.id,req.auth.id,req.body.body.trim()]);
  await audit(req.auth.id,req.params.id,'comment_created');
  res.status(201).json({id,ok:true});
 }));
 app.post('/api/projects/:id/approvals/:approvalId/decision',sameOrigin,authed,csrf,requireId,asyncRoute(async(req,res)=>{
  if(req.auth.role!=='client'||!await allowed(req,req.params.id))return give(res,404,'Project not found');
  if(!validId(req.params.approvalId)||!['approved','changes_requested'].includes(req.body?.decision))return give(res,400,'Invalid decision');
  const result=await db.query(
   "UPDATE approvals SET status=$1,decided_by=$2,decided_at=now() WHERE id=$3 AND project_id=$4 AND status='pending' RETURNING id",
   [req.body.decision,req.auth.id,req.params.approvalId,req.params.id]
  );
  if(!result.rowCount)return give(res,409,'Approval not pending');
  await audit(req.auth.id,req.params.id,'approval_decided',{approvalId:req.params.approvalId,decision:req.body.decision});
  res.json({ok:true});
 }));
 app.post('/api/admin/projects',sameOrigin,authed,csrf,admin,asyncRoute(async(req,res)=>{
  const {title,summary='',previewUrl=null}=req.body||{};
  if(!validText(title,120)||!validText(summary,2000,0))return give(res,400,'Invalid project details');
  const safePreview=previewUrl===null||previewUrl===''?null:safeHttpUrl(previewUrl);
  if(previewUrl && !safePreview)return give(res,400,'Preview must be HTTPS');
  const id=uuid();
  await db.query('INSERT INTO projects(id,title,summary,preview_url) VALUES($1,$2,$3,$4)',[id,title.trim(),summary.trim(),safePreview]);
  await audit(req.auth.id,id,'project_created');
  res.status(201).json({id});
 }));
 app.patch('/api/admin/projects/:id',sameOrigin,authed,csrf,admin,requireId,asyncRoute(async(req,res)=>{
  const {stage,progress,previewUrl}=req.body||{};
  if(!stageValues.has(stage)||!Number.isInteger(progress)||progress<0||progress>100)return give(res,400,'Invalid progress or stage');
  const url=previewUrl===null||previewUrl===''?null:safeHttpUrl(previewUrl);
  if(previewUrl&&!url)return give(res,400,'Preview URL must be HTTPS');
  const q=await db.query('UPDATE projects SET stage=$1,progress=$2,preview_url=$3 WHERE id=$4 RETURNING id',[stage,progress,url,req.params.id]);
  if(!q.rowCount)return give(res,404,'Project not found');
  await audit(req.auth.id,req.params.id,'project_updated',{stage,progress});res.json({ok:true});
 }));
 app.post('/api/admin/projects/:id/milestones',sameOrigin,authed,csrf,admin,requireId,asyncRoute(async(req,res)=>{
  const {title,status='planned',position=0}=req.body||{};
  if(!validText(title,130)||!milestoneValues.has(status)||!Number.isInteger(position)||position<0||position>1000)return give(res,400,'Invalid milestone');
  const q=await db.query('INSERT INTO milestones(id,project_id,title,status,position) VALUES($1,$2,$3,$4,$5) RETURNING id',[uuid(),req.params.id,title.trim(),status,position]);
  await audit(req.auth.id,req.params.id,'milestone_created');res.status(201).json({id:q.rows[0].id});
 }));
 app.post('/api/admin/projects/:id/approvals',sameOrigin,authed,csrf,admin,requireId,asyncRoute(async(req,res)=>{
  if(!validText(req.body?.version,80))return give(res,400,'Version label required');
  const id=uuid();
  await db.query('INSERT INTO approvals(id,project_id,version_label,requested_by) VALUES($1,$2,$3,$4)',[id,req.params.id,req.body.version.trim(),req.auth.id]);
  await audit(req.auth.id,req.params.id,'approval_requested',{approvalId:id});res.status(201).json({id});
 }));
 app.post('/api/admin/projects/:id/invites',sameOrigin,authed,csrf,admin,requireId,asyncRoute(async(req,res)=>{
  const email=normalizeEmail(req.body?.email);if(!email)return give(res,400,'Valid email required');
  const p=await db.query('SELECT 1 FROM projects WHERE id=$1',[req.params.id]);if(!p.rowCount)return give(res,404,'Project not found');
  const exists=await db.query('SELECT 1 FROM users WHERE email=$1',[email]);if(exists.rowCount)return give(res,409,'Account already exists; add existing member instead');
  const token=opaque();
  await db.query("INSERT INTO invitations(token_hash,project_id,email,issued_by,expires_at) VALUES($1,$2,$3,$4,now()+interval '48 hours')",
    [digest(token),req.params.id,email,req.auth.id]);
  await audit(req.auth.id,req.params.id,'invite_created',{email});
  res.status(201).json({expiresHours:48,inviteUrl:origin+'/#invite='+encodeURIComponent(token)});
 }));
 app.post('/api/admin/projects/:id/members',sameOrigin,authed,csrf,admin,requireId,asyncRoute(async(req,res)=>{
  const email=normalizeEmail(req.body?.email);if(!email)return give(res,400,'Valid email required');
  const q=await db.query("INSERT INTO project_members(project_id,user_id) SELECT $1,u.id FROM users u JOIN projects p ON p.id=$1 WHERE u.email=$2 AND u.role='client' AND u.active=TRUE ON CONFLICT DO NOTHING RETURNING user_id",
    [req.params.id,email]);
  if(!q.rowCount)return give(res,404,'Client not found, project not found, or already assigned');
  await audit(req.auth.id,req.params.id,'client_assigned',{email});res.status(201).json({ok:true});
 }));


 // Credential change requires current password and invalidates every session, including this one.
 app.post('/api/me/password',sameOrigin,authed,csrf,asyncRoute(async(req,res)=>{
  const currentPassword=req.body?.currentPassword,newPassword=req.body?.newPassword;
  if(typeof currentPassword!=='string'||!validatePassword(newPassword)||currentPassword===newPassword)return give(res,400,'Invalid password change');
  const q=await db.query('SELECT password_hash FROM users WHERE id=$1 AND active=TRUE',[req.auth.id]);
  if(!q.rowCount||!await verifyPassword(currentPassword,q.rows[0].password_hash))return give(res,403,'Current password incorrect');
  const encoded=await hashPassword(newPassword),tx=await db.connect();
  try{
   await tx.query('BEGIN');
   await tx.query('UPDATE users SET password_hash=$1 WHERE id=$2 AND active=TRUE',[encoded,req.auth.id]);
   await tx.query('DELETE FROM sessions WHERE user_id=$1',[req.auth.id]);
   await tx.query('DELETE FROM mfa_challenges WHERE user_id=$1',[req.auth.id]);
   await tx.query('INSERT INTO audit_events(id,actor_id,event) VALUES($1,$2,$3)',[uuid(),req.auth.id,'password_changed']);
   await tx.query('COMMIT');
  }catch(error){await tx.query('ROLLBACK');throw error}finally{tx.release()}
  res.setHeader('Set-Cookie',sessionCookie('',0));
  res.json({ok:true,reauthenticate:true});
 }));

 // Administrative access controls. Never derive project membership from client-supplied role data.
 app.get('/api/admin/projects/:id/access',authed,admin,requireId,asyncRoute(async(req,res)=>{
  const exists=await db.query('SELECT 1 FROM projects WHERE id=$1',[req.params.id]);
  if(!exists.rowCount)return give(res,404,'Project not found');
  const [members,invites]=await Promise.all([
   db.query("SELECT u.id,u.display_name,u.email,u.active FROM project_members m JOIN users u ON u.id=m.user_id WHERE m.project_id=$1 AND u.role='client' ORDER BY u.created_at,u.id",[req.params.id]),
   db.query('SELECT email,created_at,expires_at FROM invitations WHERE project_id=$1 AND accepted_at IS NULL AND expires_at>now() ORDER BY created_at DESC',[req.params.id])
  ]);
  res.json({members:members.rows,pendingInvitations:invites.rows});
 }));
 // Revocation is effective on the very next request: every project read/write checks membership.
 app.delete('/api/admin/projects/:id/members/:userId',sameOrigin,authed,csrf,admin,requireId,asyncRoute(async(req,res)=>{
  if(!validId(req.params.userId))return give(res,400,'Invalid client id');
  const q=await db.query("DELETE FROM project_members m USING users u WHERE m.project_id=$1 AND m.user_id=$2 AND u.id=m.user_id AND u.role='client' RETURNING m.user_id",[req.params.id,req.params.userId]);
  if(!q.rowCount)return give(res,404,'Project membership not found');
  await audit(req.auth.id,req.params.id,'membership_revoked',{clientId:req.params.userId});
  res.json({ok:true});
 }));
 app.delete('/api/admin/projects/:id/invitations',sameOrigin,authed,csrf,admin,requireId,asyncRoute(async(req,res)=>{
  const email=normalizeEmail(req.body?.email);
  if(!email)return give(res,400,'Valid email required');
  const q=await db.query('DELETE FROM invitations WHERE project_id=$1 AND email=$2 AND accepted_at IS NULL RETURNING token_hash',[req.params.id,email]);
  if(!q.rowCount)return give(res,404,'Pending invitation not found');
  await audit(req.auth.id,req.params.id,'invitation_revoked',{email});
  res.json({ok:true,revoked:q.rowCount});
 }));
 // Disabling a client also revokes every active session in the same database transaction.
 // Admin accounts deliberately cannot be disabled through this endpoint.
 app.post('/api/admin/clients/:id/status',sameOrigin,authed,csrf,admin,requireId,asyncRoute(async(req,res)=>{
  if(typeof req.body?.active!=='boolean')return give(res,400,'Boolean active state required');
  const active=req.body.active,client=await db.connect();
  try{
   await client.query('BEGIN');
   const q=await client.query("UPDATE users SET active=$1 WHERE id=$2 AND role='client' RETURNING id,email",[active,req.params.id]);
   if(!q.rowCount){await client.query('ROLLBACK');return give(res,404,'Client not found')}
   if(!active){
    await client.query('DELETE FROM sessions WHERE user_id=$1',[req.params.id]);
    await client.query('DELETE FROM mfa_challenges WHERE user_id=$1',[req.params.id]);
   }
   await client.query('INSERT INTO audit_events(id,actor_id,event,details) VALUES($1,$2,$3,$4)',[uuid(),req.auth.id,active?'client_enabled':'client_disabled',JSON.stringify({clientId:req.params.id})]);
   await client.query('COMMIT');res.json({ok:true,active});
  }catch(e){await client.query('ROLLBACK');throw e}finally{client.release()}
 }));
 // Self-service emergency session revocation across browsers/devices.
 app.post('/api/me/sessions/revoke-all',sameOrigin,authed,csrf,asyncRoute(async(req,res)=>{
  await db.query('DELETE FROM sessions WHERE user_id=$1',[req.auth.id]);
  await db.query('DELETE FROM mfa_challenges WHERE user_id=$1',[req.auth.id]);
  res.setHeader('Set-Cookie',sessionCookie('',0));
  res.json({ok:true});
 }));

 app.use('/api',(req,res)=>give(res,404,'Not found'));
 app.use(express.static(appDir,{index:'index.html',maxAge:'10m',dotfiles:'deny',fallthrough:false}));
 app.use((err,req,res,next)=>{
  console.error('KRM portal error',err?.code||err?.name||'unknown');
  if(err?.type==='entity.too.large')return give(res,413,'Request too large');
  if(err?.type==='entity.parse.failed')return give(res,400,'Malformed JSON');
  if(res.headersSent)return next(err);
  give(res,500,'Internal error');
 });
 return app;
}

export function poolFromEnv(){
 if(!process.env.DATABASE_URL)throw Error('DATABASE_URL missing');
 return new pg.Pool({connectionString:process.env.DATABASE_URL,max:8,connectionTimeoutMillis:7000,idleTimeoutMillis:30000});
}
