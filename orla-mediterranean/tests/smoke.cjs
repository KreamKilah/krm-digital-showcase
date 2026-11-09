const {chromium}=require('playwright');const fs=require('node:fs');
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const url='https://kreamkilah.github.io/krm-digital-showcase/orla-mediterranean/?qa=01';
fs.mkdirSync('orla-qa',{recursive:true});let fail=false;const results=[];
for(const width of [360,390,768,1024,1440]){
 const ctx=await browser.newContext({viewport:{width,height:width<=390?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});if(!response||response.status()!==200)throw Error('Page status '+(response?.status()||'unknown'));
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.hero-title').waitFor({state:'visible',timeout:12000});
  const layout=await page.evaluate(()=>{
   const r=document.querySelector('.hero-title').getBoundingClientRect();
   const words=[...document.querySelectorAll('.hero-title span')].map(el=>{const x=el.getBoundingClientRect();return {text:el.innerText,left:Math.round(x.left),right:Math.round(x.right)}});
   return {overflow:document.documentElement.scrollWidth-innerWidth,client:innerWidth,titleLeft:Math.round(r.left),titleRight:Math.round(r.right),words}
  });
  await page.screenshot({path:'orla-qa/hero-'+width+'.png'});
  if(layout.overflow>3)throw Error('Horizontal overflow '+layout.overflow+'px '+JSON.stringify(layout.words));
  if(layout.words.some(w=>w.left<0||w.right>width+4))throw Error('Clipped hero title '+JSON.stringify(layout.words));
  if(width<=900){await page.locator('#mobileMenu').click();if(await page.locator('#mobileMenu').getAttribute('aria-expanded')!=='true')throw Error('Mobile nav failed to open');await page.locator('#navlinks a[href="#menu"]').click();if(await page.locator('#mobileMenu').getAttribute('aria-expanded')!=='false')throw Error('Mobile nav failed to close');}
  await page.locator('#menu').scrollIntoViewIfNeeded();
  await page.locator('[data-category="mains"]').click();
  const mains=await page.locator('#menuPanel h3').allTextContents();
  if(mains.length!==3||!mains.some(x=>x.includes('Linguine')))throw Error('Menu category switch did not render main dishes '+JSON.stringify(mains));
  await page.locator('[data-category="sweet"]').click();
  const desserts=await page.locator('#menuPanel h3').allTextContents();
  if(desserts.length!==3||!desserts.some(x=>x.includes('Cake')))throw Error('Dessert switch failed');
  await page.locator('#reservieren').scrollIntoViewIfNeeded();
  await page.locator('#guestCount').selectOption('4');await page.locator('#sampleDay').selectOption('Tag B');await page.locator('#sampleTime').selectOption('20:30');
  const summary=await page.locator('#reserveSummary').textContent();if(summary!=='4 Personen · Tag B · 20:30')throw Error('Reservation demo state mismatch '+summary);
  await page.screenshot({path:'orla-qa/reservation-'+width+'.png'});
  await page.locator('#reservePreview').click();if(!await page.locator('#reservationModal').evaluate(el=>el.open))throw Error('Reservation preview modal did not open');
  const modalSummary=await page.locator('#modalSummary').textContent();if(!modalSummary.includes('4 Personen')||!modalSummary.includes('DEMO ONLY'))throw Error('Modal lacks demo summary');
  await page.locator('#closeModal').click();if(await page.locator('#reservationModal').evaluate(el=>el.open))throw Error('Modal failed to close');
  const pictures=await page.evaluate(()=>[...document.querySelectorAll('img')].map(img=>({src:img.currentSrc||img.src,ok:img.complete&&img.naturalWidth>0,naturalWidth:img.naturalWidth,loading:img.loading})));
  const failedImages=pictures.filter(x=>!x.ok);if(failedImages.length)throw Error('Broken/unloaded images '+JSON.stringify(failedImages.slice(0,9)));
  if(errors.length)throw Error('Page JS errors '+errors.join(';'));
  results.push({width,pass:true,layout,images:pictures.length,menu:'pass',booking:'pass',errors});
 }catch(e){fail=true;const diagnostics=await page.evaluate(()=>({oversize:[...document.querySelectorAll('body *')].map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,50):'',left:Math.round(r.left),right:Math.round(r.right),scroll:el.scrollWidth,client:el.clientWidth}}).filter(o=>o.right>innerWidth+3&&o.left<innerWidth+60).slice(0,14),images:[...document.querySelectorAll('img')].map(x=>({src:x.currentSrc||x.src,ok:x.complete&&x.naturalWidth>0}))})).catch(()=>({}));results.push({width,pass:false,error:e.message,diagnostics,errors})}
 await ctx.close();
}
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const page=await context.newPage(),jsErrors=[];page.on('pageerror',e=>jsErrors.push(e.message));
try{await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});await page.locator('#gerichte').scrollIntoViewIfNeeded();await page.waitForTimeout(650);
const state=await page.evaluate(()=>({cardOpacity:getComputedStyle(document.querySelector('.dish-card')).opacity,overflow:document.documentElement.scrollWidth-innerWidth}));
if(jsErrors.length||state.overflow>3)throw Error('Animation/overflow '+JSON.stringify({state,jsErrors}));
results.push({mode:'normal-motion',pass:true,state});
}catch(e){fail=true;results.push({mode:'normal-motion',pass:false,error:e.message,jsErrors})}
await context.close();await browser.close();
fs.writeFileSync('orla-qa/report.json',JSON.stringify(results,null,2));console.log('ORLA QA RESULTS '+JSON.stringify(results));if(fail)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});