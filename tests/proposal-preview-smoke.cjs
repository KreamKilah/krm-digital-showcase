const assert=require('node:assert/strict');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const host='http://127.0.0.1:8767';
const server=spawn('python3',['-m','http.server','8767','--bind','127.0.0.1'],{cwd:path.join(__dirname,'..'),stdio:'ignore'});
async function ready(){for(let i=0;i<45;i++){try{if((await fetch(host+'/brief-builder/')).ok)return}catch(e){}await new Promise(r=>setTimeout(r,200))}throw Error('local server not responding')}
async function settle(page){await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))))}
async function assertWidth(page,width){
 await settle(page);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 assert.ok(overflow<=3,'proposal overflow at '+width+'px: '+overflow);
}
(async()=>{
 let browser;
 try{
  await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const reports=[];
  for(const width of [360,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
   const page=await context.newPage(),errors=[],posts=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))posts.push(r.url())});
   await page.goto(host+'/brief-builder/',{waitUntil:'domcontentloaded'});
   await page.locator('[data-lang="pt"]').click();
   await page.locator('#industryOptions [data-option="restaurant"]').click();
   await page.locator('#goalOptions [data-option="presence"]').click();
   await page.locator('#brandName').fill('Café Aurora');
   for(let i=0;i<4;i++)await page.locator('#next').click();
   assert.equal(await page.locator('.stage[data-step="4"]').isVisible(),true);
   await page.locator('#openProposal').click();
   assert.equal(await page.locator('#proposalPreview').isVisible(),true);
   assert.match(await page.locator('.demo-warning').textContent(),/NÃO ATIVO/);
   await page.locator('#proposalGenerate').click();
   assert.match(await page.locator('#proposalError').textContent(),/nome/);
   await page.locator('#leadName').fill('Bruno Teste');
   await page.locator('#proposalGenerate').click();
   assert.match(await page.locator('#proposalError').textContent(),/e-mail válido/);
   await page.locator('#leadEmail').fill('fake@exemplo.test');
   await page.locator('#leadCompany').fill('<img src=x onerror="alert(1)">');
   await page.locator('#leadMessage').fill('Projeto fictício para teste.');
   await page.locator('#proposalGenerate').click();
   assert.match(await page.locator('#proposalError').textContent(),/demonstração/);
   await page.locator('#leadDemoAck').check();
   await page.locator('#proposalGenerate').click();
   assert.equal(await page.locator('#proposalResult').isVisible(),true);
   assert.match(await page.locator('#proposalResult').textContent(),/NÃO ENVIADO/);
   assert.match(await page.locator('#proposalEmail').textContent(),/nenhum pedido foi recebido/i);
   assert.equal(await page.locator('#proposalSummary img').count(),0);
   assert.equal(await page.locator('.proposal-brief-details').count(),1);
   await page.locator('.proposal-brief-details summary').click();
   assert.match(await page.locator('.proposal-brief-list').textContent(),/Café Aurora/);
   assert.equal(await page.locator('.proposal-client-demo a').getAttribute('href'),'../client-space-demo/');
   assert.match(await page.locator('#proposalSummary').textContent(),/<img src=x onerror/);
   await assertWidth(page,width);
   await page.locator('#proposalCopy').click();
   const clipboard=await page.evaluate(()=>navigator.clipboard.readText());
   assert.match(clipboard,/Bruno Teste/);
   assert.match(clipboard,/Café Aurora/);
   assert.match(clipboard,/NÃO ENVIADO/);
   const event=page.waitForEvent('download');
   await page.locator('#proposalDownload').click();
   const download=await event;
   assert.equal(download.suggestedFilename(),'KRM-proposal-demo.txt');
   await page.locator('[data-lang="en"]').click();
   assert.match(await page.locator('#proposalEmail').textContent(),/no inquiry was received/i);
   assert.match(await page.locator('#proposalResult').textContent(),/NOT SENT/);
   await assertWidth(page,width);
   await page.locator('#proposalBack').click();
   assert.equal(await page.locator('#proposalForm').isVisible(),true);
   assert.equal(await page.locator('#leadName').inputValue(),'Bruno Teste');
   await page.locator('#proposalCancel').click();
   assert.equal(await page.locator('#proposalPreview').isVisible(),false);
   assert.equal(await page.locator('#leadName').inputValue(),'');
   const persisted=await page.evaluate(()=>({local:Object.keys(localStorage),session:Object.keys(sessionStorage)}));
   assert.deepEqual(persisted.local,['krm-site-language']);
   assert.deepEqual(persisted.session,[]);
   assert.deepEqual(posts,[]);
   assert.deepEqual(errors,[]);
   reports.push({width,success:true});
   await context.close();
  }
  console.log('KRM proposal preview QA:',JSON.stringify(reports));
 }finally{if(browser)await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
