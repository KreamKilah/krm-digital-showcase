const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const results=[]; let failed=false;
 const url='https://kreamkilah.github.io/krm-digital-showcase/nova-v5-preview/';
 fs.mkdirSync('qa-screenshots',{recursive:true});
 for(const width of [390,1440]){
  const ctx=await browser.newContext({viewport:{width,height:width===390?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
   if(!resp || resp.status()>=400)throw new Error('Page status '+(resp&&resp.status()));
   await page.locator('#hero-title').waitFor({state:'visible',timeout:18000});
   const asset=await page.request.get('https://kreamkilah.github.io/nova-detail-demo-2026/assets/v5-macro.webp');
   if(asset.status()!==200)throw new Error('Original macro asset HTTP '+asset.status());
   const interior=await page.request.get('https://kreamkilah.github.io/nova-detail-demo-2026/assets/v5-interior.webp');
   if(interior.status()!==200)throw new Error('Original interior asset HTTP '+interior.status());
   const checks=await page.evaluate(()=>{
    const h=document.querySelector('#hero-title').getBoundingClientRect();
    const img=getComputedStyle(document.querySelector('.hero-bg')).backgroundImage;
    return {overflow:document.documentElement.scrollWidth-innerWidth,heroLeft:h.left,heroRight:h.right,heroVisible:h.width>30&&h.height>50,heroImage:img.includes('nova-hero.webp'),storyExists:!!document.querySelector('#erlebnis .nova-story-grid'),navigationExists:!!document.querySelector('#navlinks')};
   });
   if(checks.overflow>3)throw new Error('Horizontal overflow '+checks.overflow+'px');
   if(!checks.heroVisible||!checks.heroImage||!checks.storyExists)throw new Error('Missing hero or storyboard');
   await page.screenshot({path:'qa-screenshots/hero-'+width+'.png'});
   const light=page.locator('#studioLight'); await light.click({timeout:10000});
   if(await light.getAttribute('aria-pressed')!=='false')throw new Error('Lighting toggle failed');
   await light.click();
   if(await light.getAttribute('aria-pressed')!=='true')throw new Error('Lighting toggle restore failed');
   if(width===390){
     await page.locator('#menu').click();
     if(!(await page.locator('#navlinks').evaluate(el=>el.classList.contains('open'))))throw new Error('Mobile menu did not open');
     await page.locator('#navlinks a[href="#erlebnis"]').click();
     if(await page.locator('#navlinks').evaluate(el=>el.classList.contains('open')))throw new Error('Mobile menu did not close on link');
   }
   await page.locator('#erlebnis').scrollIntoViewIfNeeded();
   await page.locator('[data-chapter="1"]').scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
   await page.screenshot({path:'qa-screenshots/story-'+width+'.png'});
   const compare=page.locator('#split');await page.locator('#vergleich').scrollIntoViewIfNeeded();
   await compare.evaluate(el=>{el.value='72';el.dispatchEvent(new Event('input',{bubbles:true}))});
   const pos=await page.locator('#comparison').evaluate(el=>getComputedStyle(el).getPropertyValue('--split').trim());
   if(pos!=='72%')throw new Error('Comparison slider failed: '+pos);
   await page.locator('#galerie figure').first().scrollIntoViewIfNeeded();
   await page.locator('#galerie figure').first().click();
   if(!(await page.locator('#photoModal').evaluate(el=>el.open)))throw new Error('Gallery modal did not open');
   await page.locator('#closePhoto').click();
   if(await page.locator('#photoModal').evaluate(el=>el.open))throw new Error('Gallery modal did not close');
   results.push({width,pass:true,checks,errors});
  }catch(e){failed=true;results.push({width,pass:false,error:e.message,errors})}
  await ctx.close();
 }
 await browser.close();
 fs.writeFileSync('qa-screenshots/report.json',JSON.stringify(results,null,2));
 console.log('V5 QA RESULTS '+JSON.stringify(results));
 if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
