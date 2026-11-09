const {chromium}=require('playwright');const fs=require('node:fs');
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const url='https://kreamkilah.github.io/krm-digital-showcase/vanta-v6-offgrid/';
fs.mkdirSync('offgrid-qa',{recursive:true});const results=[];let failed=false;
for(const width of [360,390,768,1024,1440]){
 const ctx=await browser.newContext({viewport:{width,height:width<=390?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const response=await page.goto(url,{waitUntil:'load',timeout:45000});
  if(!response||response.status()!==200)throw Error('HTTP '+(response?.status()||'none'));
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('#hero-title').waitFor({state:'visible',timeout:13000});
  const src=await page.request.get('https://kreamkilah.github.io/krm-digital-showcase/assets/vanta-v5-hero.webp');
  if(src.status()!==200)throw Error('Hero WebP HTTP '+src.status());
  const checks=await page.evaluate(()=>{
    const hero=document.querySelector('#hero-title').getBoundingClientRect();
    const words=[...document.querySelectorAll('#hero-title .word')].map(el=>{const r=el.getBoundingClientRect();return {text:el.innerText,right:Math.round(r.right),left:Math.round(r.left)}});
    const layout={scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,viewport:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,heroRight:Math.round(hero.right),heroLeft:Math.round(hero.left),words};
    return layout;
  });
  await page.screenshot({path:'offgrid-qa/hero-'+width+'.png'});
  if(checks.overflow>3)throw Error('Horizontal overflow '+checks.overflow+'px');
  if(checks.words.some(w=>w.right>width+4||w.left < -4))throw Error('Clipped hero text '+JSON.stringify(checks.words));
  if(width<=900){
   const menu=page.locator('#menu');await menu.click();
   if(await menu.getAttribute('aria-expanded')!=='true')throw Error('Menu did not open');
   await page.locator('#navlinks a[href="#style-lab"]').click();
   if(await menu.getAttribute('aria-expanded')!=='false')throw Error('Menu did not close after nav');
  }
  await page.locator('#style-lab').scrollIntoViewIfNeeded();
  await page.locator('[data-style="2"]').click();
  const styleLabel=await page.locator('#lookCaption').textContent();
  if(!styleLabel.includes('BEARD'))throw Error('Style gallery did not change');
  const imgActive=await page.locator('[data-look="2"]').evaluate(el=>el.classList.contains('active'));
  if(!imgActive)throw Error('Style photo not active');
  await page.screenshot({path:'offgrid-qa/style-'+width+'.png'});
  await page.locator('#booking').scrollIntoViewIfNeeded();
  await page.locator('[data-service="BEARD DESIGN"]').click();
  await page.locator('[data-day="Tag B"]').click();
  await page.locator('[data-time="12:30"]').click();
  const booked=await page.evaluate(()=>[document.querySelector('#chosenService').textContent,document.querySelector('#chosenDay').textContent,document.querySelector('#chosenTime').textContent,document.querySelector('#chosenPrice').textContent]);
  if(booked.join('|')!=='BEARD DESIGN|Tag B|12:30|19 €')throw Error('Booking demo mismatch '+booked);
  await page.screenshot({path:'offgrid-qa/ticket-'+width+'.png'});
  await page.locator('#showTicket').click();if(!await page.locator('#ticketModal').evaluate(el=>el.open))throw Error('Ticket modal not open');
  if(!(await page.locator('#ticketModalSummary').textContent()).includes('BEARD DESIGN'))throw Error('Ticket modal wrong');
  await page.locator('#closeTicket').click();if(await page.locator('#ticketModal').evaluate(el=>el.open))throw Error('Modal did not close');
  if(errors.length)throw Error('JS errors '+errors.join(' / '));
  results.push({width,pass:true,checks,ticket:booked,errors});
 }catch(e){failed=true;const offenders=await page.evaluate(()=>[...document.querySelectorAll('body *')].map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,70):'',right:Math.round(r.right),left:Math.round(r.left)}}).filter(r=>r.right>innerWidth+3&&r.left<innerWidth+45).slice(0,15)).catch(()=>[]);results.push({width,pass:false,error:e.message,offenders,errors})}
 await ctx.close();
}
await browser.close();fs.writeFileSync('offgrid-qa/report.json',JSON.stringify(results,null,2));
console.log('OFFGRID QA RESULTS '+JSON.stringify(results));if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
