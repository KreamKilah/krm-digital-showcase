const path=require('node:path');
const fs=require('node:fs');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.resolve(root,'qa-screenshots');
fs.mkdirSync(out,{recursive:true});
const host='http://127.0.0.1:8771';
const server=spawn('python3',['-m','http.server','8771','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
async function ready(){for(let i=0;i<40;i++){try{if((await fetch(host+'/')).ok)return}catch(e){}await new Promise(r=>setTimeout(r,250))}throw Error('Server not ready')}
async function shot(page,name){
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 await page.screenshot({path:path.join(out,name+'.png'),fullPage:false,animations:'disabled'});
}
(async()=>{
 let browser;
 try{
  await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const {width,height,label} of [{width:390,height:844,label:'mobile'},{width:1440,height:900,label:'desktop'}]){
   const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',deviceScaleFactor:1});
   const page=await ctx.newPage();
   await page.goto(host+'/',{waitUntil:'domcontentloaded'});
   await page.locator('[data-lang="pt"]').click();
   await shot(page,'home-pt-'+label);
   await page.goto(host+'/brief-builder/',{waitUntil:'domcontentloaded'});
   await page.locator('[data-lang="pt"]').click();
   await shot(page,'brief-brand-pt-'+label);
   await page.locator('#industryOptions [data-option="restaurant"]').click();
   await page.locator('#goalOptions [data-option="booking"]').click();
   await page.locator('#brandName').fill('Café Aurora');
   for(let i=0;i<4;i++)await page.locator('#next').click();
   await shot(page,'brief-summary-pt-'+label);
   await page.locator('#openProposal').click();
   await shot(page,'request-form-pt-'+label);
   await page.locator('#leadName').fill('Demo Cliente');
   await page.locator('#leadEmail').fill('demo@example.test');
   await page.locator('#leadDemoAck').check();
   await page.locator('#proposalGenerate').click();
   await shot(page,'request-result-pt-'+label);
   await ctx.close();
  }
  console.log('Visual captures saved:',fs.readdirSync(out));
 }finally{if(browser)await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});