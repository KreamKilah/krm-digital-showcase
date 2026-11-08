const {chromium}=require('playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const url='https://kreamkilah.github.io/krm-digital-showcase/barber-v6-preview/';
 fs.mkdirSync('v6-qa',{recursive:true});
 const results=[];let anyFail=false;
 for (const width of [360,390,768,1440]) {
  const ctx=await browser.newContext({viewport:{width,height:width<=390?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
   const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
   if(!resp||resp.status()!==200)throw Error('Preview status '+(resp&&resp.status()));
   await page.locator('#heroTitle').waitFor({state:'visible',timeout:15000});
   const hero=await page.request.get('https://kreamkilah.github.io/krm-digital-showcase/assets/vanta-v5-hero.webp');
   if(hero.status()!==200)throw Error('Hero image asset HTTP '+hero.status());
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:'v6-qa/hero-'+width+'.png'});
   const layout=await page.evaluate(()=>{
    const el=document.querySelector('#heroTitle'),r=el.getBoundingClientRect();
    return {bodyWidth:document.documentElement.scrollWidth,viewport:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,heroText:el.innerText,heroVisible:r.width>100&&r.height>100,hasCover:!!document.querySelector('.cover-grid'),darkSections:!!document.querySelector('.services'),ticket:!!document.querySelector('.ticket')};
   });
   if(layout.overflow>2||!layout.heroVisible||!layout.heroText.includes('NOISE'))throw Error('Layout issue '+JSON.stringify(layout));
   if(width<=768){
    const btn=page.locator('#menuButton');
    await btn.click();
    if(await btn.getAttribute('aria-expanded')!=='true')throw Error('Hamburger did not open');
    await page.locator('#navItems a[href="#services"]').click();
    if(await btn.getAttribute('aria-expanded')!=='false')throw Error('Hamburger did not close');
   }
   const svc=page.locator('[data-svc="beard"]');await svc.scrollIntoViewIfNeeded();await svc.click();
   if(await svc.getAttribute('aria-pressed')!=='true')throw Error('Service choice not selected');
   if(!(await page.locator('#serviceFocusTitle').innerText()).includes('BEARD'))throw Error('Service preview not updated');
   await page.screenshot({path:'v6-qa/services-'+width+'.png'});
   await page.locator('#book').scrollIntoViewIfNeeded();
   await page.locator('[data-book-service="BEARD"]').click();
   await page.locator('[data-book-day="Tag B"]').click();
   await page.locator('[data-book-time="12:30"]').click();
   const summary=await page.evaluate(()=>({
    service:document.getElementById('ticketService').textContent,
    day:document.getElementById('ticketDay').textContent,
    time:document.getElementById('ticketTime').textContent,
    price:document.getElementById('ticketPrice').textContent
   }));
   if(summary.service!=='BEARD'||summary.day!=='Tag B'||summary.time!=='12:30'||summary.price!=='19 €')throw Error('Demo ticket not updated '+JSON.stringify(summary));
   await page.screenshot({path:'v6-qa/ticket-'+width+'.png'});
   await page.locator('#viewTicket').click();
   if(!await page.locator('#ticketDialog').evaluate(el=>el.open))throw Error('Ticket modal did not open');
   if(!(await page.locator('#ticketDialogSummary').innerText()).includes('12:30'))throw Error('Modal wrong summary');
   await page.locator('#ticketClose').click();
   if(await page.locator('#ticketDialog').evaluate(el=>el.open))throw Error('Ticket modal did not close');
   if(errors.length)throw Error('JS errors '+errors.join('; '));
   results.push({width,pass:true,layout,summary,errors});
  }catch(e){anyFail=true;const offenders=await page.evaluate(()=>[...document.querySelectorAll('body *')].map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,50):'',left:Math.round(r.left),right:Math.round(r.right)}}).filter(x=>x.right>innerWidth+4&&x.left<innerWidth+30).slice(0,15)).catch(()=>[]);results.push({width,pass:false,error:e.message,offenders,errors})}
  await ctx.close();
 }
 const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
 const page=await ctx.newPage(),jsErrors=[];page.on('pageerror',e=>jsErrors.push(e.message));
 try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.locator('#heroTitle').waitFor({state:'visible'});
  await page.locator('#services').scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
  const motion=await page.evaluate(()=>({canAnimate:document.documentElement.classList.contains('can-animate'),revealed:document.querySelectorAll('[data-reveal].visible').length,overflow:document.documentElement.scrollWidth-innerWidth}));
  if(!motion.canAnimate||motion.revealed<2||motion.overflow>2||jsErrors.length)throw Error('Motion check '+JSON.stringify({motion,jsErrors}));
  await page.screenshot({path:'v6-qa/desktop-motion-1440.png'});
  results.push({mode:'normal-motion',pass:true,motion,errors:jsErrors});
 }catch(e){anyFail=true;results.push({mode:'normal-motion',pass:false,error:e.message,errors:jsErrors})}
 await ctx.close();await browser.close();
 fs.writeFileSync('v6-qa/report.json',JSON.stringify(results,null,2));
 console.log('VANTA V6 QA RESULTS '+JSON.stringify(results));
 if(anyFail)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});