const {chromium}=require('playwright'); const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const results=[];let failed=false;
fs.mkdirSync('qa-client-space',{recursive:true});
const url='https://kreamkilah.github.io/krm-digital-showcase/client-space-demo/?qa=client-space-v1';
for(const width of [360,390,768,1440]){
 const ctx=await browser.newContext({viewport:{width,height:width<=390?844:900},reducedMotion:'reduce',deviceScaleFactor:1});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});if(!response||response.status()!==200)throw Error('HTTP '+(response?.status()??'unknown'));
  await page.locator('#dashboardTitle').waitFor({state:'visible',timeout:15000});
  await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'qa-client-space/dashboard-'+width+'.png'});
  const geometry=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth-innerWidth,visiblePanels:[...document.querySelectorAll('.section-panel.active')].map(e=>e.id)}));
  if(geometry.overflow>3)throw Error('Horizontal overflow '+geometry.overflow);
  if(geometry.visiblePanels.join()!=='page-dashboard')throw Error('Dashboard state wrong');
  if(!(await page.locator('.demo-warning').textContent()).includes('KEINE ECHTEN KUNDENDATEN'))throw Error('Public demo disclaimer missing');
  await page.locator('[data-page=projekt]').click();
  if(!await page.locator('#page-projekt').isVisible())throw Error('Project tab did not open');
  await page.locator('[data-page=feedback]').click();
  if(!await page.locator('#page-feedback').isVisible())throw Error('Feedback tab did not open');
  const text='<script>document.body.dataset.xss="yes"</script> Ich möchte den Header ändern.';
  await page.locator('#feedbackInput').fill(text);await page.locator('#feedbackForm button[type=submit]').click();
  const posts=page.locator('#feedbackList .feedback-item');
  if(await posts.count()!==3)throw Error('Local demo feedback not appended');
  if(!(await posts.last().innerText()).includes('Ich möchte den Header ändern'))throw Error('Feedback content missing');
  if(await page.locator('body').getAttribute('data-xss'))throw Error('Unsafe feedback escaped incorrectly');
  if((await page.locator('#toast').textContent()).includes('gesendet')===false)throw Error('No local-only feedback confirmation');
  await page.screenshot({path:'qa-client-space/feedback-'+width+'.png'});
  await page.locator('[data-page=dateien]').click();if(!await page.locator('#page-dateien').isVisible())throw Error('Files tab failed');
  const link=await page.locator('.file-row a').first().getAttribute('href');if(!link.includes('vanta-offgrid-preview'))throw Error('Wrong preview file link');
  await page.locator('[data-page=rechnungen]').click();if(!await page.locator('#page-rechnungen').isVisible())throw Error('Billing tab failed');
  if(!(await page.locator('#page-rechnungen').innerText()).includes('keine gültige Rechnung'))throw Error('Billing fiction disclaimer missing');
  await page.locator('[data-page=dashboard]').click();await page.locator('#approval').click();
  if(!(await page.locator('#approvalState').textContent()).includes('Nichts wurde gespeichert'))throw Error('Approval demo not disclosed');
  if(errors.length)throw Error('Page JS errors '+errors.join(' / '));
  results.push({width,pass:true,geometry,feedbackCount:await posts.count(),errors});
 }catch(e){failed=true;const overflow=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+3&&r.left<innerWidth+45}).slice(0,12).map(el=>({el:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,60):'',scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}))).catch(()=>[]);
  results.push({width,pass:false,error:e.message,errors,overflow})}
 await ctx.close();
}
await browser.close();fs.writeFileSync('qa-client-space/report.json',JSON.stringify(results,null,2));console.log('KRM CLIENT SPACE QA '+JSON.stringify(results));if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});