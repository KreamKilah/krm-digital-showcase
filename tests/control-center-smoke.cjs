'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),host='http://127.0.0.1:8774';
const server=spawn('python3',['-m','http.server','8774','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
const art=path.join(root,'qa-control-center');fs.mkdirSync(art,{recursive:true});
const wait=ms=>new Promise(done=>setTimeout(done,ms));
async function ready(){for(let i=0;i<40;i++){try{if((await fetch(host+'/control-center-demo/')).ok)return}catch(e){}await wait(250)}throw Error('No server')}
async function go(page,width,view){
 if(width<=800)await page.locator('#mobileMenu').click();
 await page.locator('.nav-btn[data-view="'+view+'"]').click();
 assert.equal(await page.locator('#view-'+view).isVisible(),true);
}
async function checkOverflow(page,width){
 await page.evaluate(()=>document.fonts.ready);
 const n=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 assert.ok(n<=3,'Document horizontal overflow '+n+'px at '+width+'px');
}
(async()=>{
 let browser;
 try{
  await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const results=[];
  for(const width of [360,390,768,1440]){
   const ctx=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce',acceptDownloads:true,permissions:['clipboard-read','clipboard-write'],deviceScaleFactor:1});
   const page=await ctx.newPage(),errors=[],writes=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.method()+' '+r.url())});
   await page.goto(host+'/control-center-demo/',{waitUntil:'domcontentloaded'});
   assert.match(await page.locator('.demo-ribbon').textContent(),/DEMONSTRAÇÃO/);
   assert.equal(await page.locator('#metricOpen').textContent(),'3');
   assert.equal(await page.locator('#metricBuild').textContent(),'1');
   assert.equal(await page.locator('#metricQuotes').textContent(),'1');
   await checkOverflow(page,width);
   await page.screenshot({path:path.join(art,'overview-'+width+'.png'),fullPage:false,animations:'disabled'});

   await go(page,width,'pipeline');
   assert.equal(await page.locator('.lane-card').count(),4);
   await page.locator('#searchRequests').fill('Café Aurora');
   assert.equal(await page.locator('.lane-card').count(),1);
   await page.locator('#searchRequests').fill('');
   await page.locator('.lane-card[data-open="KRM-001"]').click();
   assert.equal(await page.locator('#drawer').getAttribute('aria-hidden'),'false');
   await page.locator('#drawerStage').selectOption('review');
   assert.match(await page.locator('#drawerBody').textContent(),/Em análise/);
   await page.locator('#drawerClose').click();
   assert.equal(await page.locator('.lane-card').count(),4);
   assert.equal(await page.locator('#drawer').getAttribute('aria-hidden'),'true');
   await page.screenshot({path:path.join(art,'pipeline-'+width+'.png'),fullPage:false,animations:'disabled'});

   await go(page,width,'projects');
   assert.equal(await page.locator('.project-card').count(),4);

   await go(page,width,'proposals');
   await page.locator('#proposalProject').selectOption('KRM-001');
   assert.match(await page.locator('#quoteWorkspace').textContent(),/ainda não tem rascunho/);
   await page.locator('#quoteCreate').click();
   assert.equal(await page.locator('[data-quote-index]').count(),3);
   await page.locator('[data-quote-index="0"]').fill('200');
   assert.match(await page.locator('#quoteTotal').textContent(),/760/);
   const download=page.waitForEvent('download');
   await page.locator('#quoteDownload').click();
   const saved=await download;assert.match(saved.suggestedFilename(),/KRM-proposta-KRM-001-DEMO.txt/);
   await page.locator('#quoteCopy').click();
   const copied=await page.evaluate(()=>navigator.clipboard.readText());
   assert.match(copied,/Café Aurora/);
   assert.match(copied,/760/);
   assert.match(copied,/DOCUMENTO DE TESTE/);
   await page.screenshot({path:path.join(art,'proposal-'+width+'.png'),fullPage:false,animations:'disabled'});

   await go(page,width,'tasks');
   assert.equal(await page.locator('.task-row').count(),7);
   await page.locator('#taskProjectFilter').selectOption('KRM-004');
   assert.equal(await page.locator('.task-row').count(),3);
   await page.locator('#newTaskInput').fill('Testar nova secção fictícia');
   await page.locator('#addTask').click();
   assert.equal(await page.locator('.task-row').count(),4);
   const task=page.locator('.task-row').filter({hasText:'Testar nova secção fictícia'});
   await task.locator('input').check();
   assert.match(await task.getAttribute('class'),/done/);
   await task.locator('button').click();
   assert.equal(await page.locator('.task-row').count(),3);
   await page.screenshot({path:path.join(art,'tasks-'+width+'.png'),fullPage:false,animations:'disabled'});

   await page.locator('#newRequest').click();
   assert.equal(await page.locator('#modalBackdrop').isVisible(),true);
   await page.locator('#demoBrand').fill('<img src=x onerror=alert(1)>');
   await page.locator('#demoCategory').selectOption('service');
   await page.locator('#newRequestForm button[type=submit]').click();
   assert.equal(await page.locator('#modalBackdrop').isVisible(),false);
   assert.equal(await page.locator('.lane-card').count(),5);
   assert.equal(await page.locator('.lane-card img').count(),0);
   assert.match(await page.locator('#pipelineBoard').textContent(),/<img src=x onerror=alert\(1\)>/);
   const sampleBrief=[
    'KRM DIGITAL — BRIEF CRIATIVO',
    '================================',
    'Nome do projeto: Café Teste',
    'Setor: Restaurante / Café',
    'Objetivo principal: Permitir reservas',
    'Páginas pretendidas: Página inicial, Menu, Contacto',
    'Idiomas do site: Alemão, Português',
    'Estilo visual: Editorial',
    'Orçamento indicativo: 300–600 €',
    'CONCEITO NÃO VINCULATIVO'
   ].join('\\n');
   await page.locator('#importBriefFile').setInputFiles({name:'KRM-demo.txt',mimeType:'text/plain',buffer:Buffer.from(sampleBrief)});
   assert.equal(await page.locator('.lane-card').count(),6);
   assert.match(await page.locator('#pipelineBoard').textContent(),/Café Teste/);
   await page.locator('#importBriefFile').setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('Não é um briefing KRM')});
   assert.equal(await page.locator('.lane-card').count(),6);
   await checkOverflow(page,width);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[]);
   assert.deepEqual(await page.evaluate(()=>Object.keys(sessionStorage)),[]);
   page.once('dialog',d=>d.accept());
   await page.locator('#resetDemo').click();
   assert.equal(await page.locator('#metricOpen').textContent(),'3');
   assert.equal(await page.locator('#metricQuotes').textContent(),'1');
   await page.reload({waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('#metricTasks').textContent(),'5');
   assert.deepEqual(errors,[]);
   assert.deepEqual(writes,[]);
   results.push({width,passed:true});
   await ctx.close();
  }
  console.log('KRM Control Center QA:',JSON.stringify(results));
  console.log('Screenshots:',fs.readdirSync(art).length);
 }finally{if(browser)await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
