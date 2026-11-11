/**
 * KRM Digital — dependency-free static quality gate.
 * Run: node tests/site-integrity.cjs
 * This is NOT a substitute for browser or production deployment testing.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const files={
home:read('index.html'),homeI18n:read('i18n.js'),
brief:read('brief-builder/index.html'),briefApp:read('brief-builder/app.js'),
proposal:read('brief-builder/proposal-preview.js'),
style:read('brief-builder/style.css'),proposalStyle:read('brief-builder/proposal-preview.css'),
client:read('client-space-demo/index.html')
};
const checks=[];
function check(name,fn){try{fn();checks.push({name,pass:true})}catch(e){checks.push({name,pass:false,error:e.message})}}
function literal(src,start,end){
 const s=src.indexOf(start);assert.ok(s>=0,'Missing start '+start);
 const e=src.indexOf(end,s+start.length);assert.ok(e>=0,'Missing end '+end);
 return vm.runInNewContext('('+src.slice(s+start.length,e)+')',Object.create(null),{timeout:500});
}
const I=literal(files.briefApp,'const I=',';\nconst defs=');
const P=literal(files.proposal,'const loc=',';\nlet generated=');
const defs=literal(files.briefApp,'const defs=',';\nconst multiple=');
const match=(src,re)=>[...src.matchAll(re)].map(x=>x[1]);
const unique=xs=>[...new Set(xs)];
function allKeys(src,attr){return unique(match(src,new RegExp(attr+'="([^"]+)"','g')))}
const html=files.brief;
check('Three-language translation coverage',()=>{
 for(const lang of ['de','pt','en']){
  assert.ok(I[lang]&&P[lang],lang+' dictionary missing');
  for(const key of allKeys(html,'data-i').concat(allKeys(html,'data-ph')))
    assert.equal(typeof I[lang][key],'string','Missing '+lang+' brief '+key);
  for(const key of allKeys(html,'data-p').concat(allKeys(html,'data-p-placeholder')))
    assert.equal(typeof P[lang][key],'string','Missing '+lang+' proposal '+key);
  assert.equal(I[lang].fields.length,18,lang+' field count');
  for(const [group,values] of Object.entries(defs)){
    assert.ok(I[lang].options[group],lang+' options missing for '+group);
    for(const v of values)assert.equal(typeof I[lang].options[group][v],'string',lang+' option '+group+'/'+v);
  }
 }
});
check('Every option group has a matching accessible container',()=>{
 for(const group of Object.keys(defs)){
  assert.ok(html.includes('id="'+group+'Options"'),'No container for '+group);
  assert.ok(html.includes('aria-labelledby="'+group+'Label"'),'Missing group name for '+group);
 }
});
check('No duplicate HTML IDs',()=>{
 const ids=match(html,/\bid="([^"]+)"/g);assert.deepEqual(ids.filter((k,i)=>ids.indexOf(k)<i),[]);
 const lookups=unique(match(files.briefApp,/\$\('([^']+)'\)/g).concat(match(files.proposal,/\$\('([^']+)'\)/g)));
 for(const key of lookups)assert.ok(ids.includes(key),'Missing DOM target '+key);
});
check('JavaScript compiles',()=>{
 for(const [file,code] of [['i18n.js',files.homeI18n],['brief-builder/app.js',files.briefApp],['brief-builder/proposal-preview.js',files.proposal]])
  new vm.Script(code,{filename:file});
});
check('Page links and resources are present',()=>{
 assert.match(files.home,/href="\.\/brief-builder\/"/);
 assert.match(html,/href="\.\.\/client-space-demo\/"/);
 assert.match(html,/src="\.\/app.js"/);
 assert.match(html,/src="\.\/proposal-preview.js"/);
 assert.match(html,/href="\.\/style.css"/);
 assert.match(html,/href="\.\/proposal-preview.css"/);
 for(const asset of ['brand/krm-horizontal.webp','brand/favicon.ico'])
  assert.ok(fs.existsSync(path.join(root,asset)),'Missing brand asset '+asset);
});
check('Forms are separated and no real submission exists',()=>{
 assert.equal((html.match(/<form\b/g)||[]).length,2);
 assert.equal((html.match(/<\/form>/g)||[]).length,2);
 const js=files.briefApp+'\n'+files.proposal;
 assert.doesNotMatch(js,/\b(fetch|XMLHttpRequest|sendBeacon|WebSocket)\s*\(/);
 assert.match(html,/DEMO · NICHT AKTIV/);
 assert.match(files.proposal,/NICHT GESENDET/);
 assert.match(files.proposal,/NÃO ENVIADO/);
});
check('Local-only exports and limited persistence',()=>{
 assert.match(files.briefApp,/new Blob\(/);
 assert.match(files.proposal,/new Blob\(/);
 assert.match(files.briefApp,/krm-site-language/);
 assert.doesNotMatch(files.proposal,/(?:localStorage|sessionStorage)\.setItem/);
 assert.doesNotMatch(files.briefApp,/(?:localStorage|sessionStorage)\.setItem\((?!'krm-site-language')/);
});
check('Responsive CSS and warnings',()=>{
 assert.match(files.style,/@media\(max-width:600px\)/);
 assert.match(files.proposalStyle,/@media\(max-width:650px\)/);
 assert.match(files.briefApp,/requiredError:/);
 assert.match(files.proposal,/errorEmail:/);
 assert.match(files.proposal,/ackLabel:/);
});
check('Public client portal remains explicitly a demo',()=>{
 assert.match(files.client,/Demo-Kunde/);
 assert.match(files.client,/Demo/);
 assert.match(html,/Client Space/);
});
for(const c of checks)console.log((c.pass?'PASS ':'FAIL ')+c.name+(c.error?': '+c.error:''));
console.log('Static checks passed: '+checks.filter(c=>c.pass).length+'/'+checks.length);
if(checks.some(c=>!c.pass))process.exitCode=1;
