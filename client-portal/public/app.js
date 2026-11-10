const $=sel=>document.querySelector(sel);
const $$=sel=>[...document.querySelectorAll(sel)];
const labels={overview:'VISÃO GERAL',projects:'PROJETOS',updates:'COMENTÁRIOS',approvals:'APROVAÇÕES',files:'FICHEIROS',admin:'ADMINISTRAÇÃO'};
const stages={briefing:'Briefing',design:'Design',development:'Desenvolvimento',review:'Revisão',delivered:'Entregue'};
const phases={planned:'Planeado',active:'Em curso',done:'Concluído'};
let me=null,csrf='',projects=[],selectedId=null,detail=null,invitationToken=null;
let noticeTimer;
function showNotice(message){const e=$('#toast');e.textContent=message;e.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>e.hidden=true,4600)}
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e}
function clear(element){element.replaceChildren()}
function safeLink(input){
 try{const url=new URL(input);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null}catch{return null}
}
async function request(endpoint,{method='GET',body}={}){
 const headers={Accept:'application/json'};
 if(body!==undefined)headers['Content-Type']='application/json';
 if(method!=='GET'&&csrf)headers['X-CSRF-Token']=csrf;
 const r=await fetch('/api'+endpoint,{method,headers,body:body!==undefined?JSON.stringify(body):undefined,credentials:'same-origin',cache:'no-store'});
 let data={};try{data=await r.json()}catch{}
 if(!r.ok)throw Error(data.error||'Ocorreu um erro no servidor ('+r.status+').');
 return data;
}
function showAuth(){
 $('#auth-screen').hidden=false;$('#app-screen').hidden=true;me=null;csrf='';projects=[];selectedId=null;detail=null;
}
function showInvite(token){
 invitationToken=token;$('#auth-screen').hidden=false;$('#app-screen').hidden=true;
 $('#invite-panel').hidden=false;$('#login-panel').hidden=true;
}
function openApp(user){
 me=user;$('#auth-screen').hidden=true;$('#app-screen').hidden=false;
 $('#account-name').textContent=user.name;$('#account-role').textContent=user.role==='admin'?'ADMINISTRADOR':'CLIENTE';
 $('#avatar').textContent=(user.name||user.email).trim().charAt(0).toUpperCase();
 $('#stat-role').textContent=user.role==='admin'?'ADMIN':'CLIENT';
 if(user.role==='admin'&&!$('[data-view=admin]')){
  const b=node('button');b.type='button';b.dataset.view='admin';
  b.append(node('span',null,'⚙'),node('span',null,'Gestão'));
  $('.nav').append(b);b.addEventListener('click',()=>showView('admin'));
 }
 showView('overview');
}
function showView(view){
 if(!me||!labels[view]||(view==='admin'&&me.role!=='admin'))return;
 $$('.view').forEach(el=>el.hidden=el.id!=='view-'+view);
 $$('[data-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===view));
 $('#crumb-view').textContent=labels[view];
 $('#workspace-title').textContent=(
  {overview:'O teu projeto, num só lugar.',projects:'Projetos com transparência.',updates:'Feedback organizado.',approvals:'Decisões e aprovações.',files:'Tudo no seu lugar.',admin:'Gestão KRM DIGITAL.'}
 )[view];
 $('#workspace-intro').textContent=(
  {overview:'Todas as etapas, decisões e atualizações organizadas.',projects:'Acompanha as versões e o desenvolvimento de cada projeto.',updates:'Mensagens ligadas ao projeto correto.',approvals:'Verifica e aprova versões com histórico.',files:'Documentos e entregáveis protegidos por permissões.',admin:'Criar projetos e gerir o progresso dos clientes.'}
 )[view];
 window.scrollTo(0,0);
}
$$('[data-view]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.view)));
function projectCard(p){
 const button=node('button','project-row');button.type='button';button.classList.toggle('selected',p.id===selectedId);
 const left=node('span');left.append(node('strong',null,p.title),node('small',null,(stages[p.stage]||p.stage)+' · '+(p.summary||'Sem descrição').slice(0,95)));
 button.append(left,node('span','perc',p.progress+'%'));
 button.addEventListener('click',()=>selectProject(p.id,true));
 return button;
}
function renderProjects(){
 const list=$('#project-list');clear(list);
 $('#project-count').textContent=projects.length+' projeto(s)';
 projects.forEach(p=>list.append(projectCard(p)));
 if(!projects.length)list.append(node('p','bodycopy','Ainda não tens projetos disponíveis.'));
 $('#stat-projects').textContent=String(projects.length).padStart(2,'0');
}
function renderFeature(){
 const holder=$('#feature-project');clear(holder);
 const p=projects.find(p=>p.id===selectedId)||projects[0];
 if(!p){holder.append(node('h2',null,'Sem projetos atribuídos.'),node('p',null,'Assim que a KRM adicionar o teu projeto, vais vê-lo aqui.'));$('#stat-progress').textContent='—';return}
 holder.append(node('h2',null,p.title),node('p',null,p.summary||'Acompanha as fases e as próximas alterações.'));
 const bar=node('div','bar');const inside=node('span');inside.style.width=p.progress+'%';bar.append(inside);holder.append(bar);
 $('#stat-progress').textContent=p.progress+'%';
}
async function loadProjects(){
 const response=await request('/projects');projects=response.projects||[];
 if(!projects.some(p=>p.id===selectedId))selectedId=projects[0]?.id||null;
 renderProjects();renderFeature();
 if(selectedId)await selectProject(selectedId,false);
}
async function selectProject(id,navigate=false){
 selectedId=id;
 detail=await request('/projects/'+encodeURIComponent(id));
 renderProjects();renderFeature();renderDetail();renderComments();renderApprovals();
 if(navigate)showView('projects');
}
function renderDetail(){
 const section=$('#project-detail');
 if(!detail){section.hidden=true;return}
 section.hidden=false;
 const p=detail.project;
 $('#detail-title').textContent=p.title;$('#detail-stage').textContent=stages[p.stage]||p.stage;
 $('#detail-summary').textContent=p.summary||'Sem descrição.';$('#detail-progress').textContent=p.progress+'%';$('#detail-bar').style.width=p.progress+'%';
 const milestones=$('#milestone-list');clear(milestones);
 for(const m of detail.milestones){
  const line=node('div','milestone');const icon=node('span',null,m.status==='done'?'✓':m.status==='active'?'●':'–');
  line.append(icon,node('strong',null,m.title),node('small',null,phases[m.status]||m.status));milestones.append(line);
 }
 if(!detail.milestones.length)milestones.append(node('p','bodycopy','Ainda não existem etapas registadas.'));
 const href=safeLink(p.preview_url);
 $('#detail-link-wrap').hidden=!href;if(href)$('#detail-link').href=href;
 if(me.role==='admin'){
  $('#stage').value=p.stage;$('#progress').value=String(p.progress);$('#update-preview').value=p.preview_url||'';
 }
}
function renderComments(){
 const container=$('#comment-list');clear(container);
 if(!detail){container.append(node('p','bodycopy','Seleciona um projeto primeiro.'));return}
 for(const c of detail.comments){
  const card=node('div','comment');
  const strong=node('strong',null,c.author);
  const small=node('small',null,new Date(c.created_at).toLocaleString('pt-PT'));
  const paragraph=node('p',null,c.body);
  card.append(strong,small,paragraph);container.append(card);
 }
 if(!detail.comments.length)container.append(node('p','bodycopy','Sem comentários. Podes iniciar a conversa.'));
}
function renderApprovals(){
 const container=$('#approval-list');clear(container);
 if(!detail){container.append(node('p','bodycopy','Seleciona um projeto primeiro.'));return}
 for(const approval of detail.approvals){
  const card=node('article','approval');
  card.append(node('strong',null,'Versão '+approval.version_label),node('small',null,'Estado: '+(
   {pending:'Aguarda aprovação',approved:'Aprovado',changes_requested:'Alterações solicitadas'}[approval.status]||approval.status)));
  if(approval.status==='pending'&&me.role==='client'){
   const controls=node('div','approval-actions');
   for(const [status,label] of [['approved','Aprovar esta versão ✓'],['changes_requested','Pedir alterações ✎']]){
    const button=node('button',null,label);button.type='button';
    button.addEventListener('click',async()=>{
     try{
      await request('/projects/'+encodeURIComponent(selectedId)+'/approvals/'+encodeURIComponent(approval.id)+'/decision',{method:'POST',body:{decision:status}});
      await selectProject(selectedId,false);showNotice('Decisão registada no projeto.');
     }catch(error){showNotice(error.message)}
    });
    controls.append(button);
   }
   card.append(controls);
  }
  container.append(card);
 }
 if(!detail.approvals.length)container.append(node('p','bodycopy','Ainda não há pedidos de aprovação.'));
}
async function submit(form,handler){
 try{
  const button=form.querySelector('button[type=submit]');if(button)button.disabled=true;
  try{await handler()}finally{if(button)button.disabled=false}
 }catch(error){showNotice(error.message)}
}
$('#login-form').addEventListener('submit',event=>{
 event.preventDefault();
 submit(event.currentTarget,async()=>{
  const data=await request('/login',{method:'POST',body:{email:$('#login-email').value,password:$('#login-password').value}});
  $('#login-password').value='';csrf=data.csrf;openApp(data.user);await loadProjects();showNotice('Sessão iniciada com sucesso.');
 });
});
$('#invite-form').addEventListener('submit',event=>{
 event.preventDefault();
 submit(event.currentTarget,async()=>{
  const data=await request('/invites/accept',{method:'POST',body:{token:invitationToken,name:$('#invite-name').value,password:$('#invite-password').value}});
  $('#invite-password').value='';invitationToken=null;$('#invite-panel').hidden=true;$('#login-panel').hidden=false;
  showNotice(data.message||'Conta criada. Podes iniciar sessão.');
 });
});
$('#signout').addEventListener('click',async()=>{try{await request('/logout',{method:'POST',body:{}})}catch{}showAuth();showNotice('Sessão terminada.');});
$('#comment-form').addEventListener('submit',event=>{
 event.preventDefault();
 submit(event.currentTarget,async()=>{
  if(!selectedId)throw Error('Seleciona um projeto.');
  await request('/projects/'+encodeURIComponent(selectedId)+'/comments',{method:'POST',body:{body:$('#comment-body').value}});
  $('#comment-body').value='';await selectProject(selectedId,false);showNotice('Comentário publicado.');
 });
});
$('#create-project').addEventListener('submit',event=>{
 event.preventDefault();submit(event.currentTarget,async()=>{
  await request('/admin/projects',{method:'POST',body:{title:$('#new-title').value,summary:$('#new-summary').value,previewUrl:$('#new-preview').value||null}});
  event.currentTarget.reset();await loadProjects();showNotice('Projeto criado.');
 });
});
$('#invite-customer').addEventListener('submit',event=>{
 event.preventDefault();submit(event.currentTarget,async()=>{
  if(!selectedId)throw Error('Cria ou seleciona primeiro um projeto.');
  const data=await request('/admin/projects/'+encodeURIComponent(selectedId)+'/invites',{method:'POST',body:{email:$('#client-email').value}});
  $('#invite-link').value=data.inviteUrl;$('#invite-result').hidden=false;showNotice('Convite criado. Partilha apenas com o destinatário.');
 });
});
$('#copy-invite').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#invite-link').value);showNotice('Link do convite copiado.')}catch{showNotice('Seleciona o link e copia manualmente.')}});
$('#update-project').addEventListener('submit',event=>{
 event.preventDefault();submit(event.currentTarget,async()=>{
  if(!selectedId)throw Error('Seleciona um projeto.');
  await request('/admin/projects/'+encodeURIComponent(selectedId),{method:'PATCH',body:{stage:$('#stage').value,progress:Number($('#progress').value),previewUrl:$('#update-preview').value||null}});
  await loadProjects();showNotice('Projeto atualizado.');
 });
});
$('#new-milestone').addEventListener('submit',event=>{
 event.preventDefault();submit(event.currentTarget,async()=>{
  if(!selectedId)throw Error('Seleciona um projeto.');
  await request('/admin/projects/'+encodeURIComponent(selectedId)+'/milestones',{method:'POST',body:{title:$('#milestone-title').value}});
  event.currentTarget.reset();await selectProject(selectedId,false);showNotice('Etapa adicionada.');
 });
});
$('#request-approval').addEventListener('submit',event=>{
 event.preventDefault();submit(event.currentTarget,async()=>{
  if(!selectedId)throw Error('Seleciona um projeto.');
  await request('/admin/projects/'+encodeURIComponent(selectedId)+'/approvals',{method:'POST',body:{version:$('#approval-version').value}});
  event.currentTarget.reset();await selectProject(selectedId,false);showNotice('Pedido de aprovação criado.');
 });
});
(async function init(){
 try{
  if(location.hash.startsWith('#invite=')){
   const token=decodeURIComponent(location.hash.slice(8));history.replaceState(null,'',location.pathname);
   showInvite(token);return;
  }
  const data=await request('/me');csrf=data.csrf;openApp(data.user);await loadProjects();
 }catch{showAuth()}
})();
