const {chromium}=require('playwright');const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});fs.mkdirSync('portfolio-qa',{recursive:true});
const results=[];let failed=false;
for(const width of [390,1440]){
 const ctx=await browser.newContext({viewport:{width,height:width===390?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const resp=await page.goto('https://kreamkilah.github.io/krm-digital-showcase/?portfolio=orla-qa-01',{waitUntil:'domcontentloaded',timeout:45000});
  if(!resp||resp.status()!==200)throw Error('Portfolio HTTP '+resp?.status());
  await page.locator('#projekte').scrollIntoViewIfNeeded();
  const cards=await page.locator('#projekte .project').count();if(cards!==3)throw Error('Expected exactly three featured projects, found '+cards);
  const titles=await page.locator('#projekte .project h3').allTextContents();
  if(!titles[0].includes('NOVA')||!titles[1].includes('VANTA')||!titles[2].includes('ORLA'))throw Error('Portfolio cards order wrong '+titles);
  const orla=page.locator('#projekte .orla-project');
  const link=await orla.getAttribute('href');if(link!=='./orla-mediterranean/')throw Error('Wrong ORLA project destination '+link);
  const orlaBg=await orla.locator('.bg').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!orlaBg.includes('images.unsplash.com'))throw Error('ORLA project hero photo absent');
  const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,viewport:innerWidth}));
  await page.screenshot({path:'portfolio-qa/projects-'+width+'.png'});
  if(layout.overflow>3)throw Error('Portfolio overflow '+layout.overflow);
  await page.locator('#showroom').scrollIntoViewIfNeeded();
  await page.locator('[data-site="orla"]').click();
  const frame=page.locator('#livePreview'),src=await frame.getAttribute('src');
  const destination=await page.locator('#showOpen').getAttribute('href');
  if(!src.includes('orla-mediterranean/')||!destination.includes('orla-mediterranean/'))throw Error('ORLA showroom not switched correctly');
  if(!(await page.locator('#showTitle').textContent()).includes('ORLA'))throw Error('Showroom info not updated');
  await page.locator('[data-device="mobile"]').click();
  if(!(await page.locator('#previewOuter').evaluate(el=>el.classList.contains('mobile'))))throw Error('Mobile showroom frame not activated');
  await page.screenshot({path:'portfolio-qa/showroom-mobile-'+width+'.png'});
  await page.locator('[data-device="desktop"]').click();
  if(await page.locator('#previewOuter').evaluate(el=>el.classList.contains('mobile')))throw Error('Desktop showroom not activated');
  await page.locator('[data-site="vanta"]').click();
  if(!(await frame.getAttribute('src')).includes('vanta-offgrid-preview/'))throw Error('VANTA showcase broken after ORLA switch');
  await page.locator('[data-site="nova"]').click();
  if(!(await frame.getAttribute('src')).includes('nova-detail-demo-2026/'))throw Error('NOVA showcase broken after ORLA switch');
  if(errors.length)throw Error('JS errors '+errors.join(';'));
  results.push({width,pass:true,projects:titles,layout,orlaSource:src,showroom:'pass',errors});
 }catch(e){failed=true;results.push({width,pass:false,error:e.message,errors})}
 await ctx.close();
}
await browser.close();console.log('KRM PORTFOLIO QA '+JSON.stringify(results));fs.writeFileSync('portfolio-qa/report.json',JSON.stringify(results,null,2));if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});