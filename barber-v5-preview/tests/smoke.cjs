const { chromium } = require('playwright');
const fs=require('node:fs');
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const url='https://kreamkilah.github.io/krm-digital-showcase/barber-v5-preview/';
  fs.mkdirSync('qa-artifacts',{recursive:true});
  const results=[];let failed=false;
  for(const width of [360,390,768,1440]){
    const ctx=await browser.newContext({viewport:{width,height:width<=390?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
    const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    try{
      const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});if(!resp||resp.status()!==200)throw Error('Bad preview HTTP status '+(resp&&resp.status()));
      await page.locator('.hero-title').waitFor({state:'visible',timeout:12000});
      const hero=await page.request.get('https://kreamkilah.github.io/krm-digital-showcase/assets/vanta-v5-hero.webp');
      if(hero.status()!==200)throw Error('Original premium hero not loaded: HTTP '+hero.status());
      const inspect=await page.evaluate(()=>{
        const t=document.querySelector('.hero-title'),r=t.getBoundingClientRect(),head=getComputedStyle(document.querySelector('.hero-picture')).backgroundImage;
        return {viewport:innerWidth,bodyWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth-innerWidth,
                headingLeft:Math.round(r.left),headingRight:Math.round(r.right),headingVisible:r.width>120&&r.height>65,
                image:head.includes('vanta-v5-hero.webp'),story:!!document.querySelector('#ritual .ritual-grid'),
                booking:!!document.querySelector('#booking'), reduced:matchMedia('(prefers-reduced-motion: reduce)').matches};
      });
      await page.screenshot({path:'qa-artifacts/hero-'+width+'.png'});
      if(inspect.overflow>3)throw Error('Overflow '+inspect.overflow+'px');
      if(!inspect.headingVisible||!inspect.image||!inspect.story||!inspect.booking)throw Error('Main content not visible');
      if(width<=768){
        const menu=page.locator('#menu');await menu.click();
        if(await menu.getAttribute('aria-expanded')!=='true')throw Error('Mobile nav did not open');
        await page.locator('#links a[href="#ritual"]').click();
        if(await menu.getAttribute('aria-expanded')!=='false')throw Error('Mobile nav did not close');
      }
      await page.locator('[data-ritual="1"]').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
      await page.waitForTimeout(500);
      const caption=await page.locator('#ritualIndex').textContent();
      if(!caption.includes('02 / 03'))throw Error('Ritual scene not synced: '+caption);
      await page.screenshot({path:'qa-artifacts/ritual-'+width+'.png'});
      await page.locator('#booking').scrollIntoViewIfNeeded();
      await page.locator('[data-service="BEARD DESIGN"]').click();
      await page.locator('[data-day="Tag B"]').click();
      await page.locator('[data-time="12:30"]').click();
      const selections=await page.evaluate(()=>({service:document.getElementById('chosenService').textContent,day:document.getElementById('chosenDay').textContent,time:document.getElementById('chosenTime').textContent,price:document.getElementById('chosenPrice').textContent}));
      if(selections.service!=='BEARD DESIGN'||selections.day!=='Tag B'||selections.time!=='12:30'||!selections.price.includes('19'))throw Error('Mock booking failed '+JSON.stringify(selections));
      await page.locator('#previewBooking').click();
      if(!await page.locator('#bookingModal').evaluate(el=>el.open))throw Error('Mock modal did not open');
      const modalText=await page.locator('#bookingExact').textContent();
      if(!modalText.includes('BEARD DESIGN')||!modalText.includes('12:30'))throw Error('Mock modal summary wrong');
      await page.locator('#closeBooking').click();if(await page.locator('#bookingModal').evaluate(el=>el.open))throw Error('Mock modal did not close');
      if(errors.length)throw Error('JavaScript errors: '+errors.join(' / '));
      results.push({width,pass:true,inspect,booking:selections,errors});
    }catch(e){
      failed=true;
      const offenders=await page.evaluate(()=>[...document.querySelectorAll('body *')].map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,id:el.id,cls:typeof el.className==='string'?el.className.slice(0,50):'',left:Math.round(r.left),right:Math.round(r.right)}}).filter(x=>x.right>innerWidth+3&&x.left<innerWidth+20).slice(0,15)).catch(()=>[]);
      results.push({width,pass:false,error:e.message,offenders,errors});
    }
    await ctx.close();
  }
  const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'no-preference',hasTouch:false});
  const page=await ctx.newPage(),jsErrors=[];page.on('pageerror',e=>jsErrors.push(e.message));
  try{
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=>window.gsap && window.ScrollTrigger,{timeout:20000});
    await page.waitForTimeout(1200);
    await page.locator('#services').scrollIntoViewIfNeeded();await page.waitForTimeout(600);
    const check=await page.evaluate(()=>({gsap:window.gsap?.version,masks:document.querySelectorAll('.cinematic-veil').length,
      rules:document.querySelectorAll('.cinematic-rule').length,scrollWidth:document.documentElement.scrollWidth,
      viewport:innerWidth,heroBg:getComputedStyle(document.querySelector('.hero-picture')).backgroundImage}));
    if(check.masks<4||check.rules<3||check.scrollWidth>1443||jsErrors.length)throw Error('Cinematic motion check failed: '+JSON.stringify({check,jsErrors}));
    await page.screenshot({path:'qa-artifacts/desktop-motion-1440.png'});
    results.push({mode:'normal-motion',pass:true,check,jsErrors});
  }catch(e){failed=true;results.push({mode:'normal-motion',pass:false,error:e.message,jsErrors})}
  await ctx.close();await browser.close();
  fs.writeFileSync('qa-artifacts/report.json',JSON.stringify(results,null,2));
  console.log('VANTA V5 QA RESULTS '+JSON.stringify(results));
  if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});