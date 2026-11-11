// KRM private client frontend UX integration with stubbed API (no customer data).
import express from 'express';
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile,mkdir } from 'node:fs/promises';

const publicDir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../public');
const server=express().use(express.static(publicDir)).listen(39124,'127.0.0.1');
await new Promise(resolve=>server.once('listening',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];let failed=false;
await mkdir('ui-evidence',{recursive:true});
const projectId='513a0d21-2121-4121-8121-a123456789ab';
const clientId='513a0d21-2121-4121-8121-b123456789ab';
try{
 for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('dialog',dialog=>dialog.accept());
  let memberActive=true;
  await page.route('**/api/**',async route=>{
   const req=route.request(),pathname=new URL(req.url()).pathname,method=req.method();
   let status=200,data={ok:true};
   if(pathname==='/api/me'&&method==='GET'){status=401;data={error:'Not logged in'}}
   else if(pathname==='/api/login'&&method==='POST'){data={mfaRequired:true,challengeToken:'fake-private-mfa-challenge'}}
   else if(pathname==='/api/login/mfa'&&method==='POST'){data={user:{id:'owner',email:'owner@example.test',name:'Demo Owner',role:'admin'},csrf:'test-only-csrf'}}
   else if(pathname==='/api/projects'&&method==='GET'){data={projects:[{id:projectId,title:'Website Atelier Nord',summary:'Demo admin site',stage:'design',progress:55,preview_url:null}]}}
   else if(pathname==='/api/projects/'+projectId&&method==='GET'){data={project:{id:projectId,title:'Website Atelier Nord',summary:'Test summary',stage:'design',progress:55,preview_url:null},milestones:[],comments:[],approvals:[]}}
   else if(pathname==='/api/admin/projects/'+projectId+'/access'&&method==='GET'){data={members:memberActive?[{id:clientId,email:'client@example.test',display_name:'Demo Client',active:true}]:[],pendingInvitations:[]}}
   else if(pathname==='/api/admin/projects/'+projectId+'/members/'+clientId&&method==='DELETE'){memberActive=false}
   else if(pathname==='/api/me/mfa'&&method==='GET'){data={enabled:false,recoveryCodesRemaining:0}}
   else if(pathname==='/api/me/mfa/setup'&&method==='POST'){data={secret:'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',otpauthUri:'otpauth://totp/KRM?secret=EXAMPLE',instructions:'test'}}
   else if(pathname==='/api/me/mfa/confirm'&&method==='POST'){data={ok:true,reauthenticate:true,recoveryCodes:Array.from({length:8},(_,i)=>'TEST-CODE-'+i)}}
   else{status=404;data={error:'Missing test fixture: '+method+' '+pathname}}
   await route.fulfill({status,contentType:'application/json',body:JSON.stringify(data),headers:{'Cache-Control':'no-store'}});
  });
  try{
   await page.goto('http://127.0.0.1:39124/',{waitUntil:'networkidle',timeout:15000});
   await page.locator('#login-panel').waitFor({state:'visible'});
   await page.screenshot({path:'ui-evidence/login-'+width+'.png'});
   await page.locator('#login-email').fill('owner@example.test');
   await page.locator('#login-password').fill('ExamplePassphraseNeverReal!');
   await page.locator('#login-form button[type=submit]').click();
   await page.locator('#mfa-panel').waitFor({state:'visible'});
   await page.locator('#mfa-login-code').fill('123456');
   await page.locator('#mfa-login-form button[type=submit]').click();
   await page.locator('#app-screen').waitFor({state:'visible'});
   await page.locator('#project-count').getByText('1 projeto(s)').waitFor({timeout:10000});
   await page.screenshot({path:'ui-evidence/workspace-'+width+'.png'});
   const geometry=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
   if(geometry.scrollWidth>width+3)throw Error('Horizontal overflow: '+JSON.stringify(geometry));
   await page.locator('[data-view=admin]').click();
   await page.locator('#access-members .access-row').waitFor({timeout:10000});
   if(!(await page.locator('#access-members').innerText()).includes('client@example.test'))throw Error('Access panel missing client');
   await page.getByRole('button',{name:'Retirar do projeto'}).click();
   await page.getByText('Ainda não há clientes com acesso').waitFor();
   await page.locator('[data-view=account]').click();
   await page.locator('#mfa-setup-form').waitFor({state:'visible'});
   await page.locator('#mfa-setup-password').fill('TestNotReal!');
   await page.locator('#mfa-setup-form button[type=submit]').click();
   await page.locator('#mfa-setup-result').waitFor({state:'visible'});
   const secret=await page.locator('#mfa-setup-secret').inputValue();
   if(secret!=='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567')throw Error('Enrollment secret not displayed correctly');
   await page.locator('#mfa-confirm-code').fill('123456');
   await page.locator('#mfa-confirm-form button[type=submit]').click();
   if(!(await page.locator('#mfa-codes-modal').evaluate(el=>el.open)))throw Error('Recovery codes not visible');
   if((await page.locator('#mfa-codes-output').innerText()).split('TEST-CODE-').length!==9)throw Error('Wrong recovery code count');
   await page.screenshot({path:'ui-evidence/mfa-codes-'+width+'.png'});
   await page.locator('#mfa-codes-done').click();
   await page.locator('#login-panel').waitFor({state:'visible'});
   if(errors.length)throw Error('Page JavaScript error '+errors.join('; '));
   results.push({width,passed:true,geometry,flow:'MFA login, dashboard, admin access revoke, MFA setup, one-time codes'});
  }catch(e){failed=true;results.push({width,passed:false,error:e.message,errors})}
  await context.close();
 }
}finally{
 await browser.close();await new Promise(r=>server.close(r));
}
await writeFile('ui-evidence/report.json',JSON.stringify(results,null,2));
console.log('KRM PRIVATE UI SMOKE '+JSON.stringify(results));
if(failed)process.exitCode=1;
