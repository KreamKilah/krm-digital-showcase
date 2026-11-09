const {chromium}=require('playwright');const fs=require('node:fs');
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const url='https://kreamkilah.github.io/krm-digital-showcase/studio-next/?krm=qa1';
fs.mkdirSync('next-qa',{recursive:true});let fail=false;const results=[];
for(const width of [360,390,768,1024,1440]){
 const ctx=await browser.newContext({viewport:{width,height:width<=390?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  if(!response||response.status()!==200)throw Error('HTTP '+(response?.status()||'unknown'));
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.hero-title').waitFor({state:'visible',timeout:12000});
  const layout=await page.evaluate(()=>{
   const r=document.querySelector('.hero-title').getBoundingClientRect();
   const lines=[...document.querySelectorAll('.hero-title>span')].map(el=>{const x=el.getBoundingClientRect();return {text:el.innerText.trim().slice(0,45),left:Math.round(x.left),right:Math.round(x.right),scroll:el.scrollWidth,client:el.clientWidth}});
   return {overflow:document.documentElement.scrollWidth-innerWidth,viewport:innerWidth,titleLeft:Math.round(r.left),titleRight:Math.round(r.right),lines}
  });
  await page.screenshot({path:'next-qa/hero-'+width+'.png'});
  if(layout.overflow>3)throw Error('Horizontal overflow '+layout.overflow+'px');
  if(layout.lines.some(x=>x.left< -2||x.right>width+3))throw Error('Hero title clipping '+JSON.stringify(layout.lines));
  const projects=page.locator('.work .project');const titles=await projects.locator('h3').allTextContents();
  if(titles.length!==3||!titles[0].includes('NOVA')||!titles[1].includes('VANTA')||!titles[2].includes('orla'))throw Error('Three project identities missing '+JSON.stringify(titles));
  await page.locator('.project-vanta').scrollIntoViewIfNeeded();await page.screenshot({path:'next-qa/vanta-'+width+'.png'});
  await page.locator('.project-orla').scrollIntoViewIfNeeded();await page.screenshot({path:'next-qa/orla-'+width+'.png'});
  if(width<=900){await page.locator('#menuButton').click();if(await page.locator('#menuButton').getAttribute('aria-expanded')!=='true')throw Error('Mobile menu not open');await page.locator('#mainLinks a[href="#lab"]').click();if(await page.locator('#menuButton').getAttribute('aria-expanded')!=='false')throw Error('Mobile menu did not close')}
  await page.locator('#lab').scrollIntoViewIfNeeded();await page.locator('[data-site="vanta"]').click();
  let iframe=await page.locator('#browserPreview').getAttribute('src');
  if(!iframe.includes('vanta-offgrid-preview/'))throw Error('VANTA live showcase wrong '+iframe);
  await page.locator('[data-site="orla"]').click();iframe=await page.locator('#browserPreview').getAttribute('src');
  if(!iframe.includes('orla-mediterranean/')||!((await page.locator('#labTitle').textContent()).includes('ORLA')))throw Error('ORLA showcase switching failed');
  await page.locator('[data-device="mobile"]').click();
  if(!await page.locator('#browserFrame').evaluate(el=>el.classList.contains('mobile')))throw Error('Mobile preview mode did not activate');
  const zoom=await page.locator('#browserStage').evaluate(el=>getComputedStyle(el).getPropertyValue('--zoom'));
  if(!zoom||Number(zoom)<=0)throw Error('Mobile preview zoom failed');
  await page.screenshot({path:'next-qa/lab-mobile-'+width+'.png'});
  await page.locator('[data-device="desktop"]').click();
  if(await page.locator('#browserFrame').evaluate(el=>el.classList.contains('mobile')))throw Error('Desktop preview mode did not activate');
  await page.locator('[data-site="nova"]').click();iframe=await page.locator('#browserPreview').getAttribute('src');
  if(!iframe.includes('nova-v52-preview/'))throw Error('NOVA showcase restore failed');
  await page.locator('#brief').scrollIntoViewIfNeeded();
  await page.locator('[data-group="industry"][data-value="Immobilien"]').click();
  await page.locator('[data-group="mood"][data-value="Bold"]').click();
  await page.locator('[data-group="goal"][data-value="Buchungsablauf"]').click();
  const summary=await page.locator('#briefSummary').textContent();
  if(!summary.includes('Immobilien')||!summary.includes('Bold')||!summary.includes('Buchungsablauf'))throw Error('Brief builder state failed '+summary);
  await page.screenshot({path:'next-qa/brief-'+width+'.png'});
  if(errors.length)throw Error('JavaScript errors '+errors.join(' | '));
  results.push({width,pass:true,layout,projects:titles,showroom:'pass',brief:'pass',errors});
 }catch(e){fail=true;const diagnose=await page.evaluate(()=>({
   wide:[...document.querySelectorAll('body *')].map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,id:el.id,cls:typeof el.className==='string'?el.className.slice(0,55):'',left:Math.round(r.left),right:Math.round(r.right),delta:el.scrollWidth-el.clientWidth}}).filter(x=>x.right>innerWidth+3&&x.left<innerWidth+25).slice(0,20),
   title:[...document.querySelectorAll('.hero-title>span')].map(el=>({text:el.textContent,scroll:el.scrollWidth,client:el.clientWidth}))
 })).catch(()=>({}));results.push({width,pass:false,error:e.message,diagnose,errors})}
 await ctx.close();
}
const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>!!window.gsap&&!!window.ScrollTrigger,{timeout:22000});
 await page.waitForTimeout(1400);
 await page.locator('#work').scrollIntoViewIfNeeded();await page.waitForTimeout(500);
 const state=await page.evaluate(()=>({gsap:window.gsap.version,documentOverflow:document.documentElement.scrollWidth-innerWidth,heroTitle:document.querySelector('.hero-title').innerText,scrollerPresent:!!document.querySelector('#progress')}));
 if(state.documentOverflow>3||errors.length)throw Error('Motion mode issue '+JSON.stringify({state,errors}));
 await page.screenshot({path:'next-qa/motion-desktop-1440.png'});
 results.push({mode:'full-motion',pass:true,state,errors});
}catch(e){fail=true;results.push({mode:'full-motion',pass:false,error:e.message,errors})}
await ctx.close();await browser.close();
fs.writeFileSync('next-qa/report.json',JSON.stringify(results,null,2));console.log('KRM NEXT QA RESULTS '+JSON.stringify(results));
if(fail)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
