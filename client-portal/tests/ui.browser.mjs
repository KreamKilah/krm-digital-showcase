import { chromium } from 'playwright';
import pg from 'pg';
import { mkdir, writeFile } from 'node:fs/promises';
import { uuid, hashPassword } from '../src/security.mjs';
import { createApp } from '../src/app.mjs';

const base='http://localhost:39131',pass='StrongBrowserPassphrase!2026';
const db=new pg.Pool({connectionString:process.env.DATABASE_URL,max:6});
await db.query('TRUNCATE audit_events,login_failures,invitations,approvals,comments,milestones,project_members,projects,sessions,users RESTART IDENTITY CASCADE');
const admin=uuid(),customer=uuid(),project=uuid(),approval=uuid(),hash=await hashPassword(pass);
await db.query("INSERT INTO users(id,email,display_name,role,password_hash) VALUES($1,'admin@krm.test','KRM Admin','admin',$3),($2,'customer@krm.test','Demo Client','client',$3)",[admin,customer,hash]);
await db.query("INSERT INTO projects(id,title,summary,stage,progress,preview_url) VALUES($1,'Atelier Client','Website redesign','design',42,'https://example.com')",[project]);
await db.query('INSERT INTO project_members(project_id,user_id) VALUES($1,$2)',[project,customer]);
await db.query("INSERT INTO approvals(id,project_id,version_label,requested_by) VALUES($1,$2,'Design 1.0',$3)",[approval,project,admin]);
await db.query("INSERT INTO milestones(id,project_id,title,status,position) VALUES($1,$2,'Mobile layout','active',1)",[uuid(),project]);
const server=createApp(db,{origin:base,production:false}).listen(39131);
await new Promise(resolve=>server.once('listening',resolve));
await mkdir('qa-private',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
let failed=false;
async function signIn(page,email){
 await page.locator('#login-email').fill(email);await page.locator('#login-password').fill(pass);
 await page.locator('#login-form button[type=submit]').click();
 await page.locator('#app-screen').waitFor({state:'visible',timeout:13000});
}
for(const width of [390,1440]){
 await db.query("UPDATE approvals SET status='pending',decided_by=NULL,decided_at=NULL WHERE id=$1",[approval]);
 const context=await browser.newContext({viewport:{width,height:width===390?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const response=await page.goto(base,{waitUntil:'load',timeout:30000});
  if(response.status()!==200)throw Error('HTTP '+response.status());
  await page.locator('#auth-screen').waitFor({state:'visible'});
  await signIn(page,'customer@krm.test');
  if(await page.locator('[data-view=admin]').count())throw Error('Admin nav visible to client');
  const widthReport=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,panels:document.querySelectorAll('.view:not([hidden])').length}));
  if(widthReport.scrollWidth>width+3)throw Error('Overflow '+(widthReport.scrollWidth-width));
  if(!await page.locator('#feature-project').innerText().then(x=>x.includes('Atelier Client')))throw Error('Client project missing');
  await page.screenshot({path:'qa-private/client-dashboard-'+width+'.png'});
  await page.locator('[data-view=projects]').click();
  if(!(await page.locator('#view-projects').innerText()).includes('Mobile layout'))throw Error('Project milestone missing');
  await page.locator('[data-view=updates]').click();
  await page.locator('#comment-body').fill('<svg onload=alert(1)> Bitte den Header vergrößern.');
  await page.locator('#comment-form button[type=submit]').click();
  await page.locator('.comment').last().waitFor({state:'visible'});
  if(await page.locator('svg[onload]').count())throw Error('Dangerous comment HTML injection');
  await page.screenshot({path:'qa-private/client-feedback-'+width+'.png'});
  await page.locator('[data-view=approvals]').click();
  const approvals=page.locator('.approval-actions button');
  if(!await approvals.count())throw Error('Pending client approval not visible');
  await approvals.first().click();
  await page.waitForFunction(()=>document.querySelector('#approval-list')?.textContent?.includes('Aprovado'),{timeout:12000});
  await page.locator('#signout').click();
  await page.locator('#auth-screen').waitFor({state:'visible'});
  await signIn(page,'admin@krm.test');
  await page.locator('[data-view=admin]').click();
  await page.locator('#new-title').fill('Website Design Test');
  await page.locator('#new-summary').fill('Scope and roadmap');
  await page.locator('#create-project button[type=submit]').click();
  await page.waitForFunction(()=>Number(document.querySelector('#stat-projects').textContent)>=2,{timeout:12000});
  const count=Number((await page.locator('#stat-projects').textContent()).trim());
  if(count<2)throw Error('Admin project not created');
  await page.screenshot({path:'qa-private/admin-'+width+'.png'});
  if(errors.length)throw Error('Client portal JS errors '+errors.join(' / '));
  results.push({width,pass:true,widthReport,adminProjectCount:count});
 }catch(e){
  failed=true;
  const wide=await page.evaluate(()=>{
   const w=innerWidth;
   return [...document.querySelectorAll('body *')].map(el=>{
    const b=el.getBoundingClientRect();const css=getComputedStyle(el);
    return {tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,60):'',id:el.id,left:Math.round(b.left),right:Math.round(b.right),client:el.clientWidth,scroll:el.scrollWidth,overflow:css.overflowX}
   }).filter(x=>x.right>w+3&&x.left<w+70).sort((a,b)=>b.right-a.right).slice(0,20);
  }).catch(()=>[]);
  results.push({width,pass:false,error:e.message,errors,wide})
 }
 await context.close();
}
await browser.close();await new Promise(resolve=>server.close(resolve));await db.end();
await writeFile('qa-private/report.json',JSON.stringify(results,null,2));
console.log('PORTAL BROWSER QA '+JSON.stringify(results));
if(failed)process.exitCode=1;
