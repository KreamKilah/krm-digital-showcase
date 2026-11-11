(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const euro=num=>new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(num);
const stages=[
 {id:'new',name:'Novo',step:0},
 {id:'review',name:'Em análise',step:1},
 {id:'quoted',name:'Proposta',step:2},
 {id:'approved',name:'Aprovado',step:3},
 {id:'build',name:'Em produção',step:4},
 {id:'done',name:'Entregue',step:5}
];
const pageInfo={
 overview:{title:'CONTROL <em>CENTER.</em>',subtitle:'Todos os projetos. Uma visão. Controlo total.',label:'Visão geral',num:'01—05'},
 pipeline:{title:'PEDIDOS <em>& LEADS.</em>',subtitle:'Cada oportunidade organizada, do primeiro briefing à aprovação.',label:'Pedidos',num:'02—05'},
 projects:{title:'PROJETOS <em>KRM.</em>',subtitle:'Uma visão clara de todas as fases de produção.',label:'Projetos',num:'03—05'},
 proposals:{title:'PROPOSTAS <em>STUDIO.</em>',subtitle:'Estimativas fictícias, sempre sob revisão humana.',label:'Propostas',num:'04—05'},
 tasks:{title:'TASK <em>BOARD.</em>',subtitle:'Prioridades, detalhes e qualidade de execução.',label:'Tarefas',num:'05—05'}
};
const demoRecords=[
 {id:'KRM-001',name:'Café Aurora',category:'Restauração',goal:'Website com reservas',stage:'new',desc:'Conceito para um café contemporâneo: menu, reservas e uma identidade calorosa.',pages:['Home','Menu','Reservas','Contacto'],languages:['DE','EN'],mood:'Editorial',budget:'A definir',progress:0,notes:'Confirmar se precisa de sistema de reservas externo.'},
 {id:'KRM-002',name:'VANTA Offgrid',category:'Barbearia',goal:'Portefólio e marcações',stage:'review',desc:'Conceito fictício para barbearia experimental, linguagem visual arrojada.',pages:['Home','Serviços','Portfolio','Marcações'],languages:['DE'],mood:'Bold',budget:'A definir',progress:18,notes:'Validar navegação mobile e referências de identidade visual.'},
 {id:'KRM-003',name:'ORLA Dining',category:'Restauração',goal:'Apresentação e menu',stage:'quoted',desc:'Conceito mediterrânico, menus sazonais e experiência de navegação elegante.',pages:['Home','Menu','Sobre','Contacto'],languages:['DE','EN'],mood:'Minimal',budget:'A definir',progress:28,notes:'Aguardar revisão humana do orçamento ilustrativo.'},
 {id:'KRM-004',name:'Atelier Nord',category:'Serviços',goal:'Website institucional',stage:'build',desc:'Projeto de exemplo, com estrutura institucional, apresentação de serviços e contacto.',pages:['Home','Sobre','Serviços','Contacto'],languages:['DE'],mood:'Luxury',budget:'A definir',progress:68,notes:'Rever versão de demonstração e testar componentes em mobile.'}
];
const demoTasks=[
 {id:'T-001',record:'KRM-001',text:'Rever necessidades de reservas',done:false,priority:'Alta'},
 {id:'T-002',record:'KRM-002',text:'Confirmar estrutura visual',done:false,priority:'Normal'},
 {id:'T-003',record:'KRM-002',text:'Testar animações em telemóvel',done:true,priority:'Normal'},
 {id:'T-004',record:'KRM-003',text:'Preparar proposta de exemplo',done:false,priority:'Alta'},
 {id:'T-005',record:'KRM-004',text:'Rever tipografia responsiva',done:true,priority:'Normal'},
 {id:'T-006',record:'KRM-004',text:'Verificar imagens e contraste',done:false,priority:'Alta'},
 {id:'T-007',record:'KRM-004',text:'Fazer revisão final do formulário',done:false,priority:'Normal'}
];
const state={
 records:structuredClone(demoRecords),
 tasks:structuredClone(demoTasks),
 quotes:{'KRM-003':{items:[{label:'Estratégia e wireframe',price:140},{label:'Design de interface',price:230},{label:'Desenvolvimento responsivo',price:280}],note:'Proposta demonstrativa. Sujeita a análise do âmbito, prazo e funcionalidades.'}},
 activity:[
 {message:'Brief de exemplo criado para Café Aurora.',date:'Demo · inicial'},
 {message:'Conceito VANTA colocado em análise.',date:'Demo · inicial'},
 {message:'Rascunho de proposta ORLA preparado.',date:'Demo · inicial'},
 {message:'Atelier Nord em desenvolvimento.',date:'Demo · inicial'}
 ],
 view:'overview',selected:null,quoteProject:'KRM-003',taskFilter:'all',search:'',status:'all',counter:4,taskCounter:7,visibleNotice:true
};
let lastFocus=null,toastHandle=null;
function status(stage){return stages.find(s=>s.id===stage)||stages[0]}
function record(id){return state.records.find(r=>r.id===id)}
function stageHtml(s){return '<span class="status '+esc(s.id)+'">'+esc(s.name)+'</span>'}
function iconFor(name){return esc(name.split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase())}
function showToast(text){
 const el=$('toast');el.textContent=text;el.hidden=false;
 if(toastHandle)clearTimeout(toastHandle);
 toastHandle=setTimeout(()=>{el.hidden=true},3000);
}
function log(message){state.activity.unshift({message,date:'Agora · simulação'});state.activity=state.activity.slice(0,14)}
function view(name){
 if(!pageInfo[name])return;
 state.view=name;
 for(const p of Object.keys(pageInfo))$('view-'+p).hidden=p!==name;
 const info=pageInfo[name];$('pageHeading').innerHTML=info.title;$('pageDescription').textContent=info.subtitle;
 $('currentLocation').textContent=info.label;$('sectionNumber').textContent=info.num;
 document.querySelectorAll('.nav-btn').forEach(el=>el.classList.toggle('active',el.dataset.view===name));
 if(name==='overview')renderOverview();
 if(name==='pipeline')renderPipeline();
 if(name==='projects')renderProjects();
 if(name==='proposals')renderProposals();
 if(name==='tasks')renderTasks();
 if($('sidebar').classList.contains('open'))closeMobile();
 window.scrollTo({top:0,behavior:'instant'});
}
function syncStats(){
 $('metricOpen').textContent=state.records.filter(r=>['new','review','quoted'].includes(r.stage)).length;
 $('metricBuild').textContent=state.records.filter(r=>r.stage==='build').length;
 $('metricQuotes').textContent=Object.keys(state.quotes).length;
 $('metricTasks').textContent=state.tasks.filter(t=>!t.done).length;
 $('navCount').textContent=state.records.filter(r=>['new','review','quoted'].includes(r.stage)).length;
}
function renderOverview(){
 syncStats();
 const filtered=state.records.filter(r=>r.stage!=='done').slice(0,4);
 $('overviewPipeline').innerHTML=filtered.map(r=>'<button class="pipeline-item" type="button" data-open="'+esc(r.id)+'"><span class="company-icon">'+iconFor(r.name)+'</span><span><span class="primary-text">'+esc(r.name)+'</span><span class="sub-text">'+esc(r.id)+' · '+esc(r.category)+'</span></span>'+stageHtml(status(r.stage))+'</button>').join('');
 $('overviewActivity').innerHTML=state.activity.slice(0,5).map(a=>'<div class="activity-entry"><span class="activity-icon">↗</span><div><p>'+esc(a.message)+'</p><time>'+esc(a.date)+'</time></div></div>').join('');
 $('overviewProjects').innerHTML=state.records.filter(r=>['build','approved','quoted','review'].includes(r.stage)).slice(0,4).map(r=>'<button class="featured" type="button" data-open="'+esc(r.id)+'"><span class="featured-top"><span class="panel-kicker">'+esc(r.id)+'</span>'+stageHtml(status(r.stage))+'</span><strong>'+esc(r.name)+'</strong><small>'+esc(r.progress)+'% · Progresso fictício</small><span class="progress-bar"><i style="width:'+Math.min(100,Math.max(0,r.progress))+'%"></i></span></button>').join('');
}
function renderPipeline(){
 const active=state.records.filter(r=>(state.status==='all'||r.stage===state.status)&&(!state.search||[r.name,r.id,r.category].join(' ').toLowerCase().includes(state.search.toLowerCase())));
 $('pipelineStats').innerHTML=stages.map(s=>'<span class="stat-chip"><strong>'+state.records.filter(r=>r.stage===s.id).length+'</strong>'+esc(s.name)+'</span>').join('');
 $('pipelineBoard').innerHTML=stages.map(s=>{
  const arr=active.filter(r=>r.stage===s.id);
  return '<div class="lane"><div class="lane-head"><h3>'+esc(s.name.toUpperCase())+'</h3><span>'+arr.length+'</span></div>'+(
   arr.map(r=>'<button class="lane-card" type="button" data-open="'+esc(r.id)+'"><span class="ref">'+esc(r.id)+' / '+esc(r.category)+'</span><strong>'+esc(r.name)+'</strong><span class="card-meta"><span>'+esc(r.goal)+'</span><span>↗</span></span></button>').join('')||'<p class="lane-empty">Nenhum pedido nesta fase.</p>'
  )+'</div>'
 }).join('');
}
function renderProjects(){
 $('projectsGrid').innerHTML=state.records.map(r=>'<button class="project-card" data-open="'+esc(r.id)+'" type="button"><div class="project-top"><span class="project-ref">'+esc(r.id)+'</span>'+stageHtml(status(r.stage))+'</div><h3>'+esc(r.name)+'</h3><p>'+esc(r.desc)+'</p><div class="project-footer"><span>'+esc(r.progress)+'% exemplo</span><span>ABRIR ↗</span></div><div class="progress-bar"><i style="width:'+Math.min(100,Math.max(0,r.progress))+'%"></i></div></button>').join('');
}
function renderProjectOptions(){
 const makeOptions=(value,all=false)=> (all?'<option value="all">Todos os projetos</option>':'')+state.records.map(r=>'<option value="'+esc(r.id)+'"'+(value===r.id?' selected':'')+'>'+esc(r.name)+' / '+esc(r.id)+'</option>').join('');
 $('proposalProject').innerHTML=makeOptions(state.quoteProject);
 $('taskProjectFilter').innerHTML=makeOptions(state.taskFilter,true);
}
function quoteOf(r){return state.quotes[r.id]||null}
function totalOf(q){return q.items.reduce((s,item)=>s+Math.max(0,Number(item.price)||0),0)}
function quoteDraftText(r,q){
 const lines=q.items.map(i=>'- '+i.label+': '+euro(i.price)).join('\n');
 return [
  'KRM DIGITAL — PROPOSTA DEMONSTRATIVA / NÃO VÁLIDA',
  '============================================',
  'Projeto fictício: '+r.name+' ('+r.id+')',
  'Setor: '+r.category,'Objetivo: '+r.goal,'',
  'ITENS ILUSTRATIVOS',lines,'',
  'TOTAL SIMULADO: '+euro(totalOf(q)),
  'Nota: '+(q.note||'A definir em revisão humana.'),'',
  'DOCUMENTO DE TESTE — NÃO É PROPOSTA COMERCIAL.',
  'Não inclui IVA calculado, fatura, obrigação de pagamento, assinatura ou envio.',
  'O âmbito, preços, prazos e custos recorrentes dependem de proposta e contrato futuros.'
 ].join('\n');
}
function renderProposals(){
 renderProjectOptions();
 const r=record(state.quoteProject)||state.records[0];if(!r)return;
 state.quoteProject=r.id;$('proposalProject').value=r.id;
 const q=quoteOf(r);
 if(!q){$('quoteWorkspace').innerHTML='<div class="quote-card quote-empty">Este projeto ainda não tem rascunho de proposta. Seleciona <strong>+ Criar rascunho</strong> para preparar uma estimativa fictícia.</div>';return}
 $('quoteWorkspace').innerHTML='<div class="quote-card"><div class="quote-card-header"><div><span class="panel-kicker">PROPOSTA FICTÍCIA / '+esc(r.id)+'</span><h3>'+esc(r.name)+'</h3></div><span class="status quoted">Rascunho local</span></div>'+
 '<table class="quote-lines"><thead><tr><th>Serviço de exemplo</th><th>Valor ilustrativo (€)</th></tr></thead><tbody>'+q.items.map((it,i)=>'<tr><td>'+esc(it.label)+'</td><td><input type="number" min="0" max="100000" step="10" data-quote-index="'+i+'" value="'+esc(it.price)+'" aria-label="Preço fictício de '+esc(it.label)+'"></td></tr>').join('')+'</tbody></table>'+
 '<label class="form-field" for="quoteNote"><span class="panel-kicker">NOTAS / CONDIÇÕES A CONFIRMAR</span></label><textarea class="quote-note-input" id="quoteNote" maxlength="1000">'+esc(q.note)+'</textarea>'+
 '<div class="quote-total"><span class="panel-kicker">TOTAL FICTÍCIO</span><strong id="quoteTotal">'+euro(totalOf(q))+'</strong></div>'+
 '<div class="quote-disclaimer">Apenas um exercício de orçamento. Não constitui oferta válida, fatura, aceitação comercial ou dívida. Valores sujeitos a revisão humana e enquadramento fiscal.</div>'+
 '<div class="quote-actions"><button class="btn primary" type="button" id="quoteCopy">COPIAR RASCUNHO ↗</button><button class="btn secondary" type="button" id="quoteDownload">GUARDAR .TXT ↓</button></div>'+
 '<pre id="quotePreview" class="quote-notes" hidden></pre><button class="text-link" id="quoteToggle" type="button">Ver pré-visualização do texto ↗</button></div>';
 $('quoteWorkspace').querySelectorAll('[data-quote-index]').forEach(el=>el.addEventListener('input',()=>{
  const raw=Number(el.value);if(!Number.isFinite(raw))return;
  q.items[Number(el.dataset.quoteIndex)].price=Math.round(Math.max(0,Math.min(100000,raw)));
  $('quoteTotal').textContent=euro(totalOf(q));
  if(!$('quotePreview').hidden)$('quotePreview').textContent=quoteDraftText(r,q);
 }));
 $('quoteNote').addEventListener('input',e=>{q.note=e.target.value;if(!$('quotePreview').hidden)$('quotePreview').textContent=quoteDraftText(r,q)});
 $('quoteToggle').addEventListener('click',()=>{const el=$('quotePreview');el.hidden=!el.hidden;if(!el.hidden)el.textContent=quoteDraftText(r,q)});
 $('quoteCopy').addEventListener('click',async()=>{const ok=await copy(quoteDraftText(r,q));showToast(ok?'Rascunho copiado (não enviado).':'Cópia bloqueada: experimenta guardar o .txt.')});
 $('quoteDownload').addEventListener('click',()=>{download('KRM-proposta-'+r.id+'-DEMO.txt',quoteDraftText(r,q));showToast('Rascunho guardado localmente. Não enviado.')});
}
async function copy(s){
 try{if(navigator.clipboard?.writeText&&window.isSecureContext){await navigator.clipboard.writeText(s);return true}}catch(e){}
 const t=document.createElement('textarea');t.value=s;t.style.position='fixed';t.style.left='-9999px';document.body.appendChild(t);t.select();
 let ok=false;try{ok=document.execCommand('copy')}catch(e){}t.remove();return ok;
}
function download(name,content){
 const blob=new Blob([content],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1800);
}
function createQuote(r){
 if(!r)return;
 if(!state.quotes[r.id]){
  state.quotes[r.id]={items:[{label:'Briefing e estrutura',price:120},{label:'Design UX/UI',price:240},{label:'Desenvolvimento responsivo',price:320}],note:'Rever páginas, funcionalidades, conteúdo, alojamento, revisões e prazo com o cliente antes de qualquer proposta.'};
  log('Rascunho fictício criado para '+r.name+'.');
 }
 state.quoteProject=r.id;view('proposals');showToast('Proposta demonstrativa pronta para revisão.');
}
function renderTasks(){
 renderProjectOptions();$('taskProjectFilter').value=state.taskFilter;
 const tasks=state.tasks.filter(t=>state.taskFilter==='all'||t.record===state.taskFilter);
 $('taskSummary').innerHTML='<span class="stat-chip"><strong>'+tasks.length+'</strong>Tarefas</span><span class="stat-chip"><strong>'+tasks.filter(t=>!t.done).length+'</strong>Pendentes</span><span class="stat-chip"><strong>'+tasks.filter(t=>t.done).length+'</strong>Concluídas</span>';
 $('taskList').innerHTML=tasks.length?tasks.map(t=>'<div class="task-row '+(t.done?'done':'')+'"><input type="checkbox" aria-label="Concluir '+esc(t.text)+'" data-check="'+esc(t.id)+'" '+(t.done?'checked':'')+'><div><strong>'+esc(t.text)+'</strong><small>'+esc(record(t.record)?.name||t.record)+' · '+esc(t.priority)+'</small></div><button type="button" data-remove-task="'+esc(t.id)+'" aria-label="Eliminar tarefa '+esc(t.text)+'">×</button></div>').join(''):'<div class="empty">Sem tarefas para este filtro.</div>';
 $('taskList').querySelectorAll('[data-check]').forEach(el=>el.addEventListener('change',()=>changeTask(el.dataset.check,el.checked)));
}
function changeTask(id,done){
 const t=state.tasks.find(x=>x.id===id);if(!t)return;t.done=done;
 log((done?'Concluída: ':'Reaberta: ')+t.text+'.');
 syncStats();if(state.view==='tasks')renderTasks();
 if(state.selected){renderDrawer();}showToast(done?'Tarefa concluída (demo).':'Tarefa reaberta (demo).');
}
function removeTask(id){
 const t=state.tasks.find(x=>x.id===id);if(!t)return;state.tasks=state.tasks.filter(x=>x.id!==id);
 log('Tarefa removida: '+t.text+'.');syncStats();renderTasks();
 if(state.selected)renderDrawer();
}
function addTask(){
 const text=$('newTaskInput').value.trim();if(text.length<3){showToast('Escreve uma tarefa fictícia com pelo menos 3 caracteres.');return}
 const rid=state.taskFilter==='all'?(state.records.find(r=>r.stage==='build')||state.records[0])?.id:state.taskFilter;
 if(!rid)return;
 state.taskCounter+=1;state.tasks.push({id:'T-'+String(state.taskCounter).padStart(3,'0'),record:rid,text:text.slice(0,120),done:false,priority:'Normal'});
 log('Nova tarefa de demonstração para '+record(rid).name+'.');
 $('newTaskInput').value='';renderTasks();syncStats();showToast('Tarefa fictícia criada.');
}
function renderDrawer(){
 const r=record(state.selected);if(!r)return;
 $('drawerTitle').textContent=r.name;
 const tasks=state.tasks.filter(t=>t.record===r.id),q=quoteOf(r);
 $('drawerBody').innerHTML='<p class="drawer-ref">'+esc(r.id)+' / '+esc(r.category)+'</p>'+
 '<div class="drawer-hero">'+stageHtml(status(r.stage))+'<p>'+esc(r.desc)+'</p><div class="progress-bar"><i style="width:'+Math.min(100,Math.max(0,r.progress))+'%"></i></div><small>'+esc(r.progress)+'% de progresso fictício · '+esc(r.goal)+'</small></div>'+
 '<div class="drawer-controls"><div><label for="drawerStage">ESTADO DO PEDIDO (DEMO)</label><select id="drawerStage">'+stages.map(s=>'<option value="'+s.id+'"'+(s.id===r.stage?' selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select></div>'+
 '<div><label for="drawerNotes">NOTAS INTERNAS DE TESTE</label><textarea id="drawerNotes" maxlength="900">'+esc(r.notes)+'</textarea></div></div>'+
 '<div class="drawer-section"><h3>Briefing de exemplo</h3><div class="aside-line"><span>OBJETIVO</span><strong>'+esc(r.goal)+'</strong></div><div class="aside-line"><span>PÁGINAS</span><strong>'+esc(r.pages.join(', '))+'</strong></div><div class="aside-line"><span>ESTILO</span><strong>'+esc(r.mood)+'</strong></div><div class="aside-line"><span>IDIOMAS</span><strong>'+esc(r.languages.join(', '))+'</strong></div><div class="aside-line"><span>ORÇAMENTO</span><strong>'+esc(r.budget)+'</strong></div></div>'+
 '<div class="drawer-section"><h3>Checklist · '+tasks.filter(t=>t.done).length+'/'+tasks.length+'</h3>'+(tasks.map(t=>'<label class="drawer-task"><input type="checkbox" data-drawer-task="'+esc(t.id)+'" '+(t.done?'checked':'')+'><span>'+esc(t.text)+'</span></label>').join('')||'<p class="footnote">Nenhuma tarefa ainda.</p>')+'</div>'+
 '<div class="drawer-section"><h3>Próximas ações</h3><p class="footnote">'+(q?'Existe um rascunho de proposta fictícia, sem valor comercial.':'Ainda não foi preparada uma proposta de exemplo.')+'</p><div class="drawer-buttons"><button type="button" class="btn primary" id="drawerQuote">PREPARAR PROPOSTA ↗</button><a class="btn secondary" href="../client-space-demo/" target="_blank" rel="noopener noreferrer">CLIENT SPACE (DEMO) ↗</a></div><p class="footnote">Os dois painéis não estão sincronizados. Só demonstração, sem contas privadas.</p></div>';
 $('drawerStage').addEventListener('change',e=>{
  const prev=r.stage;r.stage=e.target.value;
  const prog={new:0,review:15,quoted:30,approved:45,build:68,done:100};
  r.progress=prog[r.stage]??r.progress;
  log(r.name+': estado alterado de '+status(prev).name+' para '+status(r.stage).name+' (demo).');
  renderDrawer();refresh();showToast('Estado alterado apenas nesta demonstração.');
 });
 $('drawerNotes').addEventListener('change',e=>{r.notes=e.target.value;log('Notas de exemplo atualizadas: '+r.name+'.')});
 $('drawerBody').querySelectorAll('[data-drawer-task]').forEach(el=>el.addEventListener('change',()=>changeTask(el.dataset.drawerTask,el.checked)));
 $('drawerQuote').addEventListener('click',()=>{closeDrawer();createQuote(r)});
}
function refresh(){syncStats();if(state.view==='overview')renderOverview();if(state.view==='pipeline')renderPipeline();if(state.view==='projects')renderProjects();if(state.view==='tasks')renderTasks()}
function openDrawer(id){
 if(!record(id))return;lastFocus=document.activeElement;state.selected=id;renderDrawer();
 $('overlay').hidden=false;$('drawer').classList.add('open');$('drawer').setAttribute('aria-hidden','false');
 $('drawerClose').focus({preventScroll:true});document.body.style.overflow='hidden';
}
function closeDrawer(){
 state.selected=null;$('drawer').classList.remove('open');$('drawer').setAttribute('aria-hidden','true');$('overlay').hidden=true;
 document.body.style.overflow='';if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});
}
function openMobile(){
 $('sidebar').classList.add('open');$('mobileMenu').setAttribute('aria-expanded','true');$('overlay').hidden=false;
}
function closeMobile(){
 $('sidebar').classList.remove('open');$('mobileMenu').setAttribute('aria-expanded','false');$('overlay').hidden=true;
}
function openModal(){
 lastFocus=document.activeElement;$('modalBackdrop').hidden=false;$('demoBrand').focus();document.body.style.overflow='hidden';
}
function closeModal(){
 $('modalBackdrop').hidden=true;$('newRequestForm').reset();document.body.style.overflow='';
 if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});
}
function addRequest(e){
 e.preventDefault();const name=$('demoBrand').value.trim(),category=$('demoCategory').selectedOptions[0]?.textContent||'Outro',goal=$('demoGoal').value;
 if(name.length<2){showToast('Indica um nome fictício com pelo menos 2 caracteres.');$('demoBrand').focus();return}
 state.counter+=1;const id='KRM-'+String(state.counter).padStart(3,'0');
 state.records.unshift({id,name:name.slice(0,70),category,goal,stage:'new',desc:'Pedido fictício criado manualmente no Control Center para testar o processo.',pages:['Home','Contacto'],languages:['DE'],mood:'A definir',budget:'A definir',progress:0,notes:'Validar necessidades e conteúdos com o cliente fictício.'});
 log('Novo pedido fictício '+id+' criado para '+name+'.');closeModal();view('pipeline');showToast('Pedido de demonstração criado. Não enviado a ninguém.');
}
function reset(){
 if(!confirm('Reiniciar os dados fictícios e apagar todas as alterações desta sessão?'))return;
 state.records=structuredClone(demoRecords);state.tasks=structuredClone(demoTasks);
 state.quotes={'KRM-003':{items:[{label:'Estratégia e wireframe',price:140},{label:'Design de interface',price:230},{label:'Desenvolvimento responsivo',price:280}],note:'Proposta demonstrativa. Sujeita a análise do âmbito, prazo e funcionalidades.'}};
 state.activity=[{message:'Dados de demonstração reiniciados.',date:'Agora · simulação'}];
 state.selected=null;state.quoteProject='KRM-003';state.taskFilter='all';state.status='all';state.search='';state.counter=4;state.taskCounter=7;
 if($('searchRequests'))$('searchRequests').value='';if($('statusFilter'))$('statusFilter').value='all';
 closeDrawer();view('overview');showToast('Demonstração reiniciada.');
}
document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.jump)));
document.addEventListener('click',e=>{const target=e.target.closest('[data-open]');if(target)openDrawer(target.dataset.open);});
$('searchRequests').addEventListener('input',e=>{state.search=e.target.value;renderPipeline()});
$('statusFilter').addEventListener('change',e=>{state.status=e.target.value;renderPipeline()});
$('proposalProject').addEventListener('change',e=>{state.quoteProject=e.target.value;renderProposals()});
$('quoteCreate').addEventListener('click',()=>createQuote(record(state.quoteProject)||state.records[0]));
$('taskProjectFilter').addEventListener('change',e=>{state.taskFilter=e.target.value;renderTasks()});
$('newTaskInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addTask()}});
$('addTask').addEventListener('click',addTask);
$('taskList').addEventListener('click',e=>{const b=e.target.closest('[data-remove-task]');if(b)removeTask(b.dataset.removeTask)});
$('newRequest').addEventListener('click',openModal);
$('newRequestForm').addEventListener('submit',addRequest);
$('modalClose').addEventListener('click',closeModal);
$('cancelNew').addEventListener('click',closeModal);
$('modalBackdrop').addEventListener('click',e=>{if(e.target===$('modalBackdrop'))closeModal()});
$('drawerClose').addEventListener('click',closeDrawer);
$('mobileMenu').addEventListener('click',()=>{$('sidebar').classList.contains('open')?closeMobile():openMobile()});
$('overlay').addEventListener('click',()=>{if(state.selected)closeDrawer();else closeMobile()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('modalBackdrop').hidden)closeModal();else if(state.selected)closeDrawer();else if($('sidebar').classList.contains('open'))closeMobile()}});
$('resetDemo').addEventListener('click',reset);
$('noticeDismiss').addEventListener('click',()=>{document.querySelector('.notice').hidden=true});
syncStats();view('overview');
})();