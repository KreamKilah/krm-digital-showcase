const {chromium}=require('playwright');const fs=require('node:fs');
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const url='https://kreamkilah.github.io/krm-digital-showcase/?brand=official-krm-01';
fs.mkdirSync('brand-qa',{recursive:true});const results=[];let failed=false;
for(const width of [360,390,768,1024,1440]){
const ctx=await browser.newContext({viewport:{width,height:width<=390?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});if(!resp||resp.status()!==200)throw Error('HTTP '+(resp?.status()||'unknown'));
 await page.locator('.logo-approved img').waitFor({state:'visible',timeout:16000});
 const expected=[
 'brand/krm-horizontal.webp','brand/krm-principal.webp','brand/krm-avatar.png','brand/favicon.ico'
 ];
 for(const p of expected){
  const response=await page.request.get('https://kreamkilah.github.io/krm-digital-showcase/'+p);
  if(response.status()!==200)throw Error('Logo asset not loaded '+p+' HTTP '+response.status());
 }
 await page.evaluate(async()=>{await document.fonts.ready;const img=document.querySelector('.logo-approved img');await img.decode()});
 const head=await page.locator('.logo-approved img').evaluate(el=>({src:el.currentSrc,naturalWidth:el.naturalWidth,naturalHeight:el.naturalHeight,cssWidth:Math.round(el.getBoundingClientRect().width)}));
 const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,viewport:innerWidth,navWidth:Math.round(document.querySelector('.nav-wrap').getBoundingClientRect().width),logoRight:Math.round(document.querySelector('.logo-approved').getBoundingClientRect().right)}));
 await page.screenshot({path:'brand-qa/hero-'+width+'.png'});
 if(layout.overflow>3)throw Error('Horizontal overflow '+layout.overflow+'px');
 if(head.naturalWidth<100||!head.src.includes('brand/krm-horizontal.webp'))throw Error('Approved brand not in top nav '+JSON.stringify(head));
 if(width<=900){
   await page.locator('#menuButton').click();
   if(await page.locator('#menuButton').getAttribute('aria-expanded')!=='true')throw Error('Mobile nav did not open');
   await page.locator('#mainLinks a[href="#work"]').click();
   if(await page.locator('#menuButton').getAttribute('aria-expanded')!=='false')throw Error('Mobile nav did not close');
 }
 await page.locator('.brand-signature').scrollIntoViewIfNeeded();
 const principal=await page.locator('.brand-signature img').evaluate(async img=>{await img.decode();return {src:img.currentSrc,width:img.naturalWidth}});
 if(!principal.src.includes('krm-principal.webp')||principal.width<100)throw Error('Main approved logo missing from studio introduction');
 await page.locator('.footer').scrollIntoViewIfNeeded();
 const footer=await page.locator('.footer-brand-approved img').evaluate(async img=>{await img.decode();return {src:img.currentSrc,width:img.naturalWidth}});
 if(!footer.src.includes('krm-principal.webp')||footer.width<100)throw Error('Footer brand integration broken');
 await page.screenshot({path:'brand-qa/footer-'+width+'.png'});
 const favicon=await page.locator('link[rel="icon"][type="image/x-icon"]').getAttribute('href');if(favicon!=='./brand/favicon.ico')throw Error('Favicon not bound');
 const projects=await page.locator('.work .project').count();if(projects!==3)throw Error('Portfolio projects changed unexpectedly');
 if(errors.length)throw Error('Page errors '+errors.join(' | '));
 results.push({width,pass:true,layout,header:head,principal,footer,errors});
}catch(e){
 failed=true;const diag=await page.evaluate(()=>[...document.querySelectorAll('body *')].map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,40):'',right:Math.round(r.right),left:Math.round(r.left)}}).filter(x=>x.right>innerWidth+3&&x.left<innerWidth+30).slice(0,16)).catch(()=>[]);
 results.push({width,pass:false,error:e.message,diag,errors});
}
await ctx.close();
}
await browser.close();fs.writeFileSync('brand-qa/report.json',JSON.stringify(results,null,2));console.log('KRM BRAND QA RESULTS '+JSON.stringify(results));if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});