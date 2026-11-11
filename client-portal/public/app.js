const $=sel=>document.querySelector(sel);
const $$=sel=>[...document.querySelectorAll(sel)];
const labels={overview:'VISÃO GERAL',projects:'PROJETOS',updates:'COMENTÁRIOS',approvals:'APROVAÇÕES',files:'FICHEIROS',account:'SEGURANÇA',admin:'ADMINISTRAÇÃO'};
const stages={briefing:'Briefing',design:'Design',development:'Desenvolvimento',review:'Revisão',delivered:'Entregue'};
const phases={planned:'Planeado',active:'Em curso',done:'Concluído'};
let me=null,csrf='',projects=[],selectedId=null,detail=null,invitationToken=null,mfaChallenge=null;
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
 for(const id of ['#project-list','#milestone-list','#comment-list','#approval-list','#feature-project']){const element=$(id);if(element)element.replaceChildren()}
 for(const id of ['#detail-title','#detail-summary','#account-name','#account-role','#approvalState']){const element=$(id);if(element)element.textContent=''}
 for(const id of ['#login-password','#comment-body','#invite-password','#invite-link','#current-password','#new-password']){const element=$(id);if(element)element.value=''}
 $('#invite-result').hidden=true;$('#project-detail').hidden=true;
 mfaChallenge=null;$('#mfa-panel').hidden=true;$('#login-panel').hidden=false;$('#invite-panel').hidden=true;
 $('#mfa-login-code').value='';$('#mfa-setup-password').value='';$('#mfa-setup-secret').value='';$('#mfa-confirm-code').value='';$('#mfa-setup-result').hidden=true;
}
function showInvite(token){
 invitationToken=token;$('#auth-screen').hidden=false;$('#app-screen').hidden=true;
 $('#invite-panel').hidden=false;$('#login-panel').hidden=true;
 $('#mfa-panel').hidden=true;mfaChallenge=null;
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
  {overview:'O teu projeto, num só lugar.',projects:'Projetos com transparência.',updates:'Feedback organizado.',approvals:'Decisões e aprovações.',files:'Tudo no seu lugar.',account:'Segurança da tua conta.',admin:'Gestão KRM DIGITAL.'}
 )[view];
 $('#workspace-intro').textContent=(
  {overview:'Todas as etapas, decisões e atualizações organizadas.',projects:'Acompanha as versões e o desenvolvimento de cada projeto.',updates:'Mensagens ligadas ao projeto correto.',approvals:'Verifica e aprova versões com histórico.',files:'Documentos e entregáveis protegidos por permissões.',account:'Altera a palavra-passe e controla as tuas sessões.',admin:'Criar projetos e gerir o progresso dos clientes.'}
 )[view];
 if(view==='admin')loadAccess().catch(error=>showNotice(error.message));
 if(view==='account')loadMfaStatus().catch(error=>showNotice(error.message));
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
 if(me?.role==='admin'&&$('#view-admin')&&!$('#view-admin').hidden)loadAccess().catch(error=>showNotice(error.message));
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
  $('#login-password').value='';
  if(data.mfaRequired){mfaChallenge=data.challengeToken;$('#login-panel').hidden=true;$('#mfa-panel').hidden=false;$('#mfa-login-code').focus();return}
  csrf=data.csrf;openApp(data.user);await loadProjects();showNotice('Sessão iniciada com sucesso.');
 });
});

$('#mfa-login-form').addEventListener('submit',event=>{
 event.preventDefault();
 submit(event.currentTarget,async()=>{
  if(!mfaChallenge)throw Error('Desafio expirado. Inicia sessão novamente.');
  const data=await request('/login/mfa',{method:'POST',body:{challengeToken:mfaChallenge,code:$('#mfa-login-code').value.trim()}});
  mfaChallenge=null;$('#mfa-login-code').value='';csrf=data.csrf;
  openApp(data.user);await loadProjects();showNotice('Autenticação 2FA validada com sucesso.');
 });
});
$('#mfa-login-cancel').addEventListener('click',()=>{
 mfaChallenge=null;$('#mfa-login-code').value='';$('#mfa-panel').hidden=true;$('#login-panel').hidden=false;
});
async function loadMfaStatus(){
 if(!me)return;
 const d=await request('/me/mfa');
 $('#mfa-status').textContent=d.enabled
  ?'2FA ativo. Códigos de recuperação disponíveis: '+d.recoveryCodesRemaining+'. Não partilhes os códigos nem a chave.'
  :'2FA ainda não está ativo. Podes configurá-lo com uma aplicação autenticadora para proteger o teu acesso.';
 $('#mfa-setup-form').hidden=!!d.enabled;
 if(d.enabled)$('#mfa-setup-result').hidden=true;
}
$('#mfa-setup-form').addEventListener('submit',event=>{
 event.preventDefault();
 submit(event.currentTarget,async()=>{
  const data=await request('/me/mfa/setup',{method:'POST',body:{currentPassword:$('#mfa-setup-password').value}});
  $('#mfa-setup-password').value='';$('#mfa-setup-secret').value=data.secret;
  $('#mfa-setup-result').hidden=false;
  showNotice('Chave 2FA gerada. Introduz o código da aplicação para ativar.');
 });
});
$('#mfa-confirm-form').addEventListener('submit',event=>{
 event.preventDefault();
 submit(event.currentTarget,async()=>{
  const data=await request('/me/mfa/confirm',{method:'POST',body:{code:$('#mfa-confirm-code').value.trim()}});
  $('#mfa-confirm-code').value='';$('#mfa-setup-secret').value='';csrf='';
  $('#mfa-codes-output').textContent=data.recoveryCodes.join('\n');
  $('#mfa-codes-modal').showModal();
 });
});
$('#mfa-codes-modal').addEventListener('cancel',event=>{event.preventDefault();showNotice('Guarda os códigos de recuperação antes de fechar.')});
$('#mfa-codes-done').addEventListener('click',()=>{
 $('#mfa-codes-modal').close();$('#mfa-codes-output').textContent='';
 showAuth();showNotice('2FA ativado. Entra novamente com palavra-passe e código.');
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
async function revokeAllSessions(){
 if(!confirm('Queres terminar todas as sessões ativas da tua conta, neste e noutros dispositivos?'))return;
 try{await request('/me/sessions/revoke-all',{method:'POST',body:{}});showAuth();showNotice('Todas as sessões foram revogadas no servidor.')}catch(e){showNotice(e.message)}
}
$('#revoke-sessions').addEventListener('click',revokeAllSessions);
$('#account-revoke-all').addEventListener('click',revokeAllSessions);
$('#change-password').addEventListener('submit',event=>{
 event.preventDefault();
 submit(event.currentTarget,async()=>{
  const currentPassword=$('#current-password').value,newPassword=$('#new-password').value;
  await request('/me/password',{method:'POST',body:{currentPassword,newPassword}});
  $('#current-password').value='';$('#new-password').value='';
  showAuth();showNotice('Palavra-passe alterada. Todas as sessões foram terminadas; entra novamente.');
 });
});

$('#comment-form').addEventListener('submit',event=>{
 event.preventDefault();
 submit(event.currentTarget,async()=>{
  if(!selectedId)throw Error('Seleciona um projeto.');
  await request('/projects/'+encodeURIComponent(selectedId)+'/comments',{method:'POST',body:{body:$('#comment-body').value}});
  $('#comment-body').value='';await selectProject(selectedId,false);showNotice('Comentário publicado.');
 });
});
$('#create-project').addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;submit(form,async()=>{
  await request('/admin/projects',{method:'POST',body:{title:$('#new-title').value,summary:$('#new-summary').value,previewUrl:$('#new-preview').value||null}});
  form.reset();await loadProjects();showNotice('Projeto criado.');
 });
});

function accessButton(label,callback){
 const btn=node('button','access-action',label);btn.type='button';
 btn.addEventListener('click',async()=>{
  btn.disabled=true;
  try{await callback();await loadAccess()}catch(e){showNotice(e.message)}finally{btn.disabled=false}
 });
 return btn;
}
async function loadAccess(){
 if(!me||me.role!=='admin')return;
 const members=$('#access-members'),invites=$('#access-invites'),status=$('#access-status');
 if(!members||!invites)return;
 clear(members);clear(invites);
 if(!selectedId){status.textContent='Seleciona um projeto para ver os acessos.';return}
 status.textContent='A verificar permissões do projeto…';
 const response=await request('/admin/projects/'+encodeURIComponent(selectedId)+'/access');
 const clients=response.members||[],pending=response.pendingInvitations||[];
 status.textContent=clients.length+' cliente(s) com acesso · '+pending.length+' convite(s) pendente(s)';
 if(!clients.length)members.append(node('p','bodycopy','Ainda não há clientes com acesso a este projeto.'));
 for(const client of clients){
  const row=node('div','access-row');const info=node('div','access-text');
  info.append(node('strong',null,client.display_name),node('small',null,client.email+(client.active?' · Ativo':' · Conta desativada')));
  const controls=node('div','access-actions');
  controls.append(accessButton('Retirar do projeto',async()=>{
   if(!confirm('Revogar imediatamente o acesso de '+client.email+' a este projeto?'))return;
   await request('/admin/projects/'+encodeURIComponent(selectedId)+'/members/'+encodeURIComponent(client.id),{method:'DELETE',body:{}});
   showNotice('Acesso ao projeto revogado imediatamente.');
  }));
  controls.append(accessButton(client.active?'Desativar conta':'Reativar conta',async()=>{
   const message=client.active?'Desativar '+client.email+' em TODOS os projetos e terminar as suas sessões?':'Reativar a conta de '+client.email+'?';
   if(!confirm(message))return;
   await request('/admin/clients/'+encodeURIComponent(client.id)+'/status',{method:'POST',body:{active:!client.active}});
   showNotice('Estado da conta atualizado no servidor.');
  }));
  row.append(info,controls);members.append(row);
 }
 if(!pending.length)invites.append(node('p','bodycopy','Sem convites pendentes.'));
 for(const invite of pending){
  const row=node('div','access-row');const info=node('div','access-text');
  info.append(node('strong',null,invite.email),node('small',null,'Expira: '+new Date(invite.expires_at).toLocaleString('pt-PT')));
  row.append(info,accessButton('Cancelar convite',async()=>{
   if(!confirm('Cancelar imediatamente o convite para '+invite.email+'?'))return;
   await request('/admin/projects/'+encodeURIComponent(selectedId)+'/invitations',{method:'DELETE',body:{email:invite.email}});
   showNotice('Convite cancelado. O link já não pode criar uma conta.');
  }));
  invites.append(row);
 }
}
$('#access-refresh').addEventListener('click',()=>loadAccess().catch(e=>showNotice(e.message)));

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
 event.preventDefault();const form=event.currentTarget;submit(form,async()=>{
  if(!selectedId)throw Error('Seleciona um projeto.');
  await request('/admin/projects/'+encodeURIComponent(selectedId)+'/milestones',{method:'POST',body:{title:$('#milestone-title').value}});
  form.reset();await selectProject(selectedId,false);showNotice('Etapa adicionada.');
 });
});
$('#request-approval').addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;submit(form,async()=>{
  if(!selectedId)throw Error('Seleciona um projeto.');
  await request('/admin/projects/'+encodeURIComponent(selectedId)+'/approvals',{method:'POST',body:{version:$('#approval-version').value}});
  form.reset();await selectProject(selectedId,false);showNotice('Pedido de aprovação criado.');
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
