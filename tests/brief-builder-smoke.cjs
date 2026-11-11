const assert=require('node:assert/strict');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');

const host='http://127.0.0.1:8766';
const server=spawn('python3',['-m','http.server','8766','--bind','127.0.0.1'],{cwd:path.join(__dirname,'..'),stdio:'ignore'});
async function ready(){
 for(let attempt=0;attempt<40;attempt++){try{const r=await fetch(host+'/brief-builder/');if(r.ok)return}catch(err){}await new Promise(resolve=>setTimeout(resolve,250))}
 throw new Error('Test web server not available');
}
async function stable(page){await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))}
async function overflow(page,label,width){
 await stable(page);
 const n=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 assert.ok(n<=3,label+' horizontal overflow '+n+'px at width '+width);
}
(async()=>{
 let browser;
 try{
  await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const reports=[];
  for(const width of [360,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(host+'/brief-builder/',{waitUntil:'domcontentloaded'});
   await page.locator('[data-lang="pt"]').click();
   await page.waitForFunction(()=>document.documentElement.lang==='pt-PT');
   assert.match(await page.locator('#stageTitle').textContent(),/A MARCA/);
   await overflow(page,'PT start',width);
   await page.locator('#next').click();
   assert.match(await page.locator('#validationError').textContent(),/Seleciona um setor/);
   await page.locator('#industryOptions [data-option="restaurant"]').click();
   await page.locator('#goalOptions [data-option="presence"]').click();
   await page.locator('#brandName').fill('Studio & Co');
   await page.locator('#audience').fill('Pessoas à procura de um serviço premium.');
   assert.equal(await page.locator('#snapBrand').textContent(),'Studio & Co');
   await page.locator('#next').click();
   assert.equal(await page.locator('.stage[data-step="1"]').isVisible(),true);
   await page.locator('#moodOptions [data-option="bold"]').click();
   await page.locator('#paletteOptions [data-option="dark"]').click();
   await page.locator('#references').fill('javascript:alert(1)');
   await page.locator('#next').click();
   assert.match(await page.locator('#validationError').textContent(),/endereço válido/);
   assert.equal(await page.locator('.stage[data-step="1"]').isVisible(),true);
   await page.locator('#references').fill('https://example.org/inspo');
   await page.locator('#visualNotes').fill('Elegante, moderno e acolhedor.');
   await page.locator('#next').click();
   assert.equal(await page.locator('.stage[data-step="2"]').isVisible(),true);
   for(const id of ['home','services','contact'])await page.locator('#pagesOptions [data-option="'+id+'"]').click();
   for(const id of ['contactForm','animations','seo'])await page.locator('#featuresOptions [data-option="'+id+'"]').click();
   assert.match(await page.locator('#snapPages').textContent(),/3 páginas/);
   await page.locator('#next').click();
   assert.equal(await page.locator('.stage[data-step="3"]').isVisible(),true);
   await page.locator('#contentOptions [data-option="partial"]').click();
   await page.locator('#logoOptions [data-option="ready"]').click();
   await page.locator('#domainOptions [data-option="help"]').click();
   await page.locator('#siteLangOptions [data-option="pt"]').click();
   await page.locator('#siteLangOptions [data-option="de"]').click();
   await page.locator('#timelineOptions [data-option="flex"]').click();
   await page.locator('#budgetOptions [data-option="mid"]').click();
   await page.locator('#extraNotes').fill('Quero uma página muito rápida.');
   await page.locator('#next').click();
   assert.equal(await page.locator('.stage[data-step="4"]').isVisible(),true);
   assert.match(await page.locator('#finalSummary').textContent(),/Studio & Co/);
   assert.match(await page.locator('#finalSummary').textContent(),/300–600 €/);
   assert.match(await page.locator('#finalSummary').textContent(),/https:\/\/example.org\/inspo/);
   assert.equal(await page.locator('#finalSummary img').count(),0);
   const textDownload=page.waitForEvent('download');
   await page.locator('#download').click();
   const download=await textDownload;
   assert.equal(download.suggestedFilename(),'KRM-brief-studio-co.txt');
   await page.locator('#copy').click();
   const copied=await page.evaluate(()=>navigator.clipboard.readText());
   assert.match(copied,/KRM DIGITAL — BRIEF CRIATIVO/);
   assert.match(copied,/Studio & Co/);
   assert.match(copied,/CONCEITO NÃO VINCULATIVO/);
   await page.locator('[data-lang="en"]').click();
   assert.match(await page.locator('#finalSummary').textContent(),/Project name/);
   assert.match(await page.locator('#finalSummary').textContent(),/Studio & Co/);
   await overflow(page,'EN summary',width);
   const keys=await page.evaluate(()=>Object.keys(localStorage));
   assert.deepEqual(keys,['krm-site-language']);
   await page.reload({waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('[data-lang="en"]').getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('#snapBrand').textContent(),'To be decided');
   assert.equal(await page.locator('#industryOptions [data-option="restaurant"]').getAttribute('aria-pressed'),'false');
   await overflow(page,'EN restart',width);
   assert.deepEqual(errors,[]);
   reports.push({width,passed:true});
   await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto(host+'/',{waitUntil:'domcontentloaded'});
  await page.locator('[data-group="industry"][data-value="Automotive"]').click();
  await page.locator('[data-group="mood"][data-value="Luxury"]').click();
  await page.locator('[data-group="goal"][data-value="Buchungsablauf"]').click();
  await page.locator('#advancedBrief').click();
  await page.waitForURL(/brief-builder/);
  assert.equal(await page.locator('#industryOptions [data-option="automotive"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#goalOptions [data-option="booking"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#moodOptions [data-option="luxury"]').getAttribute('aria-pressed'),'true');
  await context.close();
  console.log('KRM BRIEF BUILDER QA:',JSON.stringify(reports),'homepage handoff PASSED');
 }finally{if(browser)await browser.close();server.kill()}
})().catch(err=>{console.error(err);process.exitCode=1});