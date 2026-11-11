const assert=require('node:assert/strict');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');

const base='http://127.0.0.1:8765/';
const server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{cwd:path.join(__dirname,'..'),stdio:'ignore'});
const wait=(ms)=>new Promise(ok=>setTimeout(ok,ms));
async function ready(){for(let i=0;i<40;i++){try{const r=await fetch(base);if(r.ok)return;}catch(e){}await wait(250)}throw Error('Local server unavailable')}
(async()=>{
 let browser;
 try{
  await ready();
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const reports=[];
  for(const width of [360,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('[data-lang="pt"]').click();
   await page.waitForFunction(()=>document.documentElement.lang==='pt-PT');
   assert.match(await page.locator('.hero-details p').textContent(),/Não criamos sites/);
   const ptOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert.ok(ptOverflow<=3,'Portuguese document overflow '+ptOverflow+'px at '+width+'px');
   assert.match(await page.locator('#briefSummary').textContent(),/website de estilo/);
   await page.locator('[data-group="industry"][data-value="Immobilien"]').click();
   assert.match(await page.locator('#briefSummary').textContent(),/imobiliário/);
   await page.locator('[data-site="vanta"]').click();
   await page.waitForFunction(()=>document.querySelector('#labDescription').textContent.includes('barbearia'));
   await page.locator('[data-lang="en"]').click();
   await page.waitForFunction(()=>document.documentElement.lang==='en');
   assert.match(await page.locator('.hero-details p').textContent(),/forgettable websites/);
   const enOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert.ok(enOverflow<=3,'English document overflow '+enOverflow+'px at '+width+'px');
   assert.match(await page.locator('#briefSummary').textContent(),/real estate/);
   await page.locator('[data-site="orla"]').click();
   await page.waitForFunction(()=>document.querySelector('#labDescription').textContent.includes('restaurant concept'));
   await page.reload({waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('[data-lang="en"]').getAttribute('aria-pressed'),'true');
   await page.locator('[data-lang="de"]').click();
   await page.waitForFunction(()=>document.documentElement.lang==='de');
   assert.match(await page.locator('.hero-details p').textContent(),/Wir bauen/);
   if(width<=900){
    await page.locator('#menuButton').click();
    assert.equal(await page.locator('#menuButton').getAttribute('aria-expanded'),'true');
    await page.locator('#mainLinks a[href="#lab"]').click();
    assert.equal(await page.locator('#menuButton').getAttribute('aria-expanded'),'false');
   }
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert.ok(overflow<=3,'Horizontal document overflow '+overflow+'px at '+width+'px');
   assert.deepEqual(errors,[]);
   reports.push({width,pass:true,overflow,ptOverflow,enOverflow});
   await context.close();
  }
  console.log('KRM multilingual browser QA:',JSON.stringify(reports));
 }finally{if(browser)await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
