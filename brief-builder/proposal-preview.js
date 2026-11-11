(function(){
'use strict';
const $=id=>document.getElementById(id);
const loc={
de:{
eyebrow:'NEXT / REQUEST PREVIEW · DEMO',heading:'DEIN NÄCHSTER SCHRITT.',desc:'So könnte deine Angebotsanfrage später aussehen. Alle Eingaben bleiben lokal in diesem Tab und werden nicht übermittelt.',
demoBadge:'DEMO · NICHT AKTIV',demoWarning:'Keine echte Angebotsanfrage. Keine Speicherung, keine E-Mail, kein Preis und keine Auftragsbestätigung.',
stepContact:'A / KONTAKT',requiredLegend:'* PFLICHTFELD',
nameLabel:'NAME / ANSPRECHPERSON *',namePlaceholder:'Dein Name',emailLabel:'E-MAIL-ADRESSE *',emailPlaceholder:'name@example.com',companyLabel:'UNTERNEHMEN (OPTIONAL)',companyPlaceholder:'Marke / Unternehmen',countryLabel:'LAND',typeLabel:'ANFRAGE VON',typeCompany:'Unternehmen',typeIndividual:'Privatperson',messageLabel:'LETZTE DETAILS (OPTIONAL)',messagePlaceholder:'Fragen, Wünsche, offene Punkte…',
ackLabel:'Ich verstehe, dass diese Vorschau nichts an KRM sendet und keinen Auftrag auslöst. *',
close:'← ZURÜCK ZUM BRIEF',generate:'VORSCHAU ERSTELLEN ↗',
stepResult:'B / ANFRAGE-VORSCHAU',notSent:'NICHT GESENDET',resultHeading:'SO KÖNNTE DEINE ANFRAGE AUSSEHEN.',
life1:'Anfrage vorbereiten',life1sub:'Nur Vorschau',life2:'KRM prüft die Anfrage',life2sub:'Später / manuell',life3:'Individuelles Angebot',life3sub:'Preis und Zeitplan',life4:'Bestätigung & Client Space',life4sub:'Erst nach Vereinbarung',
mailTitle:'BEISPIEL / AUTOMATISCHE EINGANGSBESTÄTIGUNG',mailWarning:'Nur Textvorschau. Es wurde keine E-Mail versendet.',
copyRequest:'ENTWURF KOPIEREN ↗',downloadRequest:'ALS .TXT SPEICHERN ↓',edit:'BEARBEITEN ←',
privacy:'Zur echten Aktivierung benötigen wir noch einen sicheren Server, Datenschutzinformationen, Spam-Schutz und ein geprüftes Rechnungs-/Vertragsverfahren.',
entryText:'Möchtest du sehen, wie die nächste Phase mit Kontakt- und Anfragebestätigung aussehen könnte?',open:'ANGEBOTSANFRAGE TESTEN ↗',
errorName:'Bitte gib einen Namen mit mindestens 2 Zeichen ein.',errorEmail:'Bitte gib eine gültige E-Mail-Adresse ein.',errorAck:'Bestätige bitte, dass du den Demo-Modus verstanden hast.',
subject:'Beispiel: Dein Projektentwurf bei KRM DIGITAL',emailGreeting:'Hallo',emailReceived:'Dies ist eine DEMO-VORSCHAU, wie KRM den Eingang einer unverbindlichen Anfrage bestätigen könnte.',emailHuman:'Bei einem echten Dienst würden wir dein Briefing persönlich prüfen und dir gegebenenfalls Rückfragen oder ein individuelles Angebot senden.',emailNothing:'WICHTIG: Es wurde keine Anfrage empfangen und keine E-Mail versendet.',
docTitle:'KRM DIGITAL — ANGEBOTSANFRAGE / DEMO-ENTWURF',docNotice:'NUR VORSCHAU — NICHT GESENDET. KEINE BESTELLUNG ODER VERTRAG.',docContact:'KONTAKT',docProject:'PROJEKT-BRIEF',expandBrief:'VOLLSTÄNDIGEN PROJEKT-BRIEF ANZEIGEN',name:'Kontaktname',email:'E-Mail',company:'Unternehmen',country:'Land',customerType:'Kundentyp',message:'Zusätzliche Nachricht',notSpecified:'Nicht angegeben',
copied:'✓ Demo-Entwurf kopiert. Nichts wurde gesendet.',copyError:'Kopieren blockiert. Bitte speichere die Textdatei.',saved:'✓ Textdatei vorbereitet. Nichts wurde gesendet.',countries:{DE:'Deutschland',PT:'Portugal',ES:'Spanien',OTHER:'Anderes Land'}
},
pt:{
eyebrow:'PRÓXIMA ETAPA / PRÉ-VISUALIZAÇÃO · DEMO',heading:'O PRÓXIMO PASSO.',desc:'Vê como poderá funcionar o pedido de orçamento. Todos os dados ficam neste separador e nada é enviado.',
demoBadge:'DEMONSTRAÇÃO · NÃO ATIVO',demoWarning:'Não é um pedido real. Não guardamos nem enviamos informações, e não existe orçamento, pagamento ou encomenda.',
stepContact:'A / CONTACTOS',requiredLegend:'* CAMPOS OBRIGATÓRIOS',
nameLabel:'NOME / PESSOA DE CONTACTO *',namePlaceholder:'O teu nome',emailLabel:'E-MAIL *',emailPlaceholder:'nome@exemplo.pt',companyLabel:'EMPRESA (OPCIONAL)',companyPlaceholder:'Marca / Empresa',countryLabel:'PAÍS',typeLabel:'TIPO DE CLIENTE',typeCompany:'Empresa',typeIndividual:'Particular',messageLabel:'OUTROS DETALHES (OPCIONAL)',messagePlaceholder:'Questões, preferências, detalhes em falta…',
ackLabel:'Compreendo que isto é apenas uma demonstração. Nenhum pedido será enviado à KRM. *',
close:'← VOLTAR AO BRIEF',generate:'CRIAR SIMULAÇÃO ↗',
stepResult:'B / PRÉ-VISUALIZAÇÃO DO PEDIDO',notSent:'NÃO ENVIADO',resultHeading:'ASSIM PODERÁ SER O TEU PEDIDO.',
life1:'Preparar pedido',life1sub:'Apenas demonstração',life2:'Análise pela KRM',life2sub:'Futuramente / manual',life3:'Orçamento personalizado',life3sub:'Preço e prazo',life4:'Aprovação e Client Space',life4sub:'Só depois do acordo',
mailTitle:'EXEMPLO / CONFIRMAÇÃO AUTOMÁTICA POR E-MAIL',mailWarning:'Isto é apenas uma pré-visualização. Não foi enviado nenhum e-mail.',
copyRequest:'COPIAR RASCUNHO ↗',downloadRequest:'GUARDAR .TXT ↓',edit:'EDITAR ←',
privacy:'Antes de ativarmos pedidos reais, precisamos de um servidor seguro, política de privacidade, proteção contra spam e condições comerciais e fiscais verificadas.',
entryText:'Queres ver como funcionará a próxima etapa, com dados de contacto e confirmação do pedido?',open:'TESTAR PEDIDO DE PROPOSTA ↗',
errorName:'Introduz um nome com pelo menos 2 caracteres.',errorEmail:'Introduz um endereço de e-mail válido.',errorAck:'Confirma que compreendes que isto é apenas uma demonstração.',
subject:'Exemplo: O teu pedido à KRM DIGITAL',emailGreeting:'Olá',emailReceived:'Esta é uma PRÉ-VISUALIZAÇÃO de como a KRM poderá confirmar a receção de um pedido de proposta.',emailHuman:'Num serviço real, analisaríamos pessoalmente o briefing e entraríamos em contacto para esclarecer dúvidas ou apresentar uma proposta.',emailNothing:'IMPORTANTE: nenhum pedido foi recebido e nenhum e-mail foi enviado.',
docTitle:'KRM DIGITAL — RASCUNHO DE PEDIDO / DEMONSTRAÇÃO',docNotice:'APENAS DEMONSTRAÇÃO — NÃO ENVIADO. NÃO É CONTRATO NEM ENCOMENDA.',docContact:'CONTACTO',docProject:'BRIEFING DO PROJETO',expandBrief:'VER BRIEFING COMPLETO DO PROJETO',name:'Nome',email:'E-mail',company:'Empresa',country:'País',customerType:'Tipo de cliente',message:'Mensagem adicional',notSpecified:'Não indicado',
copied:'✓ Rascunho de demonstração copiado. Nada foi enviado.',copyError:'Não foi possível copiar. Guarda o ficheiro de texto.',saved:'✓ Ficheiro de texto preparado. Nada foi enviado.',countries:{DE:'Alemanha',PT:'Portugal',ES:'Espanha',OTHER:'Outro país'}
},
en:{
eyebrow:'NEXT STEP / REQUEST PREVIEW · DEMO',heading:'YOUR NEXT STEP.',desc:'Preview how requesting a proposal could work. All details stay in this tab and are never submitted.',
demoBadge:'DEMO · NOT ACTIVE',demoWarning:'Not a real inquiry. No information is stored or sent; no price, payment or order is created.',
stepContact:'A / CONTACT',requiredLegend:'* REQUIRED FIELDS',
nameLabel:'NAME / CONTACT PERSON *',namePlaceholder:'Your name',emailLabel:'EMAIL ADDRESS *',emailPlaceholder:'name@example.com',companyLabel:'COMPANY (OPTIONAL)',companyPlaceholder:'Brand / Company',countryLabel:'COUNTRY',typeLabel:'CUSTOMER TYPE',typeCompany:'Business',typeIndividual:'Individual',messageLabel:'ANY FINAL DETAILS (OPTIONAL)',messagePlaceholder:'Questions, preferences, anything missing…',
ackLabel:'I understand this is only a demo and no request will be submitted to KRM. *',
close:'← BACK TO BRIEF',generate:'CREATE PREVIEW ↗',
stepResult:'B / REQUEST PREVIEW',notSent:'NOT SENT',resultHeading:'THIS IS HOW YOUR REQUEST COULD LOOK.',
life1:'Prepare inquiry',life1sub:'Preview only',life2:'KRM reviews the request',life2sub:'Future / human review',life3:'Personalized quote',life3sub:'Price and timeline',life4:'Approval & Client Space',life4sub:'Only after agreement',
mailTitle:'EXAMPLE / AUTOMATIC RECEIPT CONFIRMATION',mailWarning:'This is text preview only. No email has been sent.',
copyRequest:'COPY DRAFT ↗',downloadRequest:'SAVE AS .TXT ↓',edit:'EDIT ←',
privacy:'Before enabling real requests, we need a secure server, privacy notice, spam protection and verified commercial and invoicing conditions.',
entryText:'Want to see how a quote request could work, with contact details and an example confirmation?',open:'PREVIEW PROPOSAL REQUEST ↗',
errorName:'Enter a name of at least 2 characters.',errorEmail:'Enter a valid email address.',errorAck:'Confirm you understand that this is only a demo.',
subject:'Example: Your KRM DIGITAL project request',emailGreeting:'Hello',emailReceived:'This is a PREVIEW of how KRM could confirm receipt of a non-binding proposal request.',emailHuman:'In a live service, we would personally review your brief and follow up with questions or a customized quote.',emailNothing:'IMPORTANT: no inquiry was received and no email was sent.',
docTitle:'KRM DIGITAL — REQUEST DRAFT / DEMO',docNotice:'PREVIEW ONLY — NOT SENT. NOT AN ORDER OR CONTRACT.',docContact:'CONTACT',docProject:'PROJECT BRIEF',expandBrief:'SHOW COMPLETE PROJECT BRIEF',name:'Contact name',email:'Email',company:'Company',country:'Country',customerType:'Customer type',message:'Additional message',notSpecified:'Not provided',
copied:'✓ Demo draft copied. Nothing was sent.',copyError:'Could not copy. Please save a text file.',saved:'✓ Text file prepared. Nothing was sent.',countries:{DE:'Germany',PT:'Portugal',ES:'Spain',OTHER:'Other country'}
}};
let generated=false;
function language(){const l=document.documentElement.lang;return l==='pt-PT'?'pt':l==='en'?'en':'de'}
function dict(){return loc[language()]}
function translate(){
 const t=dict();
 document.querySelectorAll('[data-p]').forEach(el=>{const key=el.dataset.p;if(typeof t[key]==='string')el.textContent=t[key]});
 document.querySelectorAll('[data-p-placeholder]').forEach(el=>{const key=el.dataset.pPlaceholder;if(typeof t[key]==='string')el.placeholder=t[key]});
 for(const el of $('leadCountry').options){const v=el.value;el.textContent=t.countries[v]}
 if(generated)renderResult();
}
function requestRows(){
 const d=dict();
 const form=[
  [d.name,$('leadName').value.trim()],
  [d.email,$('leadEmail').value.trim()],
  [d.company,$('leadCompany').value.trim()||d.notSpecified],
  [d.country,d.countries[$('leadCountry').value]],
  [d.customerType,$('leadCustomerType').selectedOptions[0].textContent],
  [d.message,$('leadMessage').value.trim()||d.notSpecified]
 ];
 const briefing=[...$('finalSummary').querySelectorAll('.result-row')].map(row=>[
  row.querySelector('dt')?.textContent?.trim()||'',
  row.querySelector('dd')?.textContent?.trim()||''
 ]);
 return {form,briefing};
}
function draftText(){
 const d=dict(),data=requestRows();
 const block=rows=>rows.map(([label,value])=>label+': '+value).join('\n');
 return d.docTitle+'\n'+'='.repeat(44)+'\n\n'+d.docNotice+'\n\n'+d.docContact+'\n'+block(data.form)+'\n\n'+d.docProject+'\n'+block(data.briefing)+'\n\n'+d.docNotice+'\n';
}
function renderResult(){
 const d=dict(),data=requestRows(),container=$('proposalSummary');container.replaceChildren();
 for(const [label,val] of data.form.slice(0,5)){
  const div=document.createElement('div');div.className='proposal-summary-row';
  const strong=document.createElement('strong');strong.textContent=label;
  const p=document.createElement('span');p.textContent=val;div.append(strong,p);container.appendChild(div);
 }
 const message=data.form[5][1],extra=document.createElement('p');extra.className='proposal-message';
 extra.textContent=d.message+': '+message;container.appendChild(extra);
 const details=document.createElement('details');details.className='proposal-brief-details';
 const summary=document.createElement('summary');summary.textContent=d.expandBrief;details.appendChild(summary);
 const body=document.createElement('dl');body.className='proposal-brief-list';
 for(const [label,value] of data.briefing){
  const row=document.createElement('div');row.className='proposal-summary-row';
  const dt=document.createElement('dt');dt.textContent=label;
  const dd=document.createElement('dd');dd.textContent=value;row.append(dt,dd);body.appendChild(row);
 }
 details.appendChild(body);container.appendChild(details);
 $('proposalEmail').textContent=d.subject+'\n\n'+d.emailGreeting+' '+$('leadName').value.trim()+',\n\n'+d.emailReceived+'\n\n'+d.emailHuman+'\n\n'+d.emailNothing+'\n\nKRM DIGITAL';
}
function setInvalid(id,yes){$(id).setAttribute('aria-invalid',String(yes))}
function validate(){
 const d=dict(),name=$('leadName').value.trim(),email=$('leadEmail').value.trim();
 for(const id of ['leadName','leadEmail'])$(id).removeAttribute('aria-invalid');
 let message='',focus='';
 if(name.length<2){message=d.errorName;focus='leadName'}
 else if(!/^[^\s@<>]{1,64}@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email)){message=d.errorEmail;focus='leadEmail'}
 else if(!$('leadDemoAck').checked){message=d.errorAck;focus='leadDemoAck'}
 const err=$('proposalError');
 if(message){err.textContent=message;err.hidden=false;if(focus!=='leadDemoAck')setInvalid(focus,true);$(focus).focus();return false}
 err.hidden=true;return true;
}
function open(){
 $('proposalPreview').hidden=false;$('proposalResult').hidden=true;$('proposalForm').hidden=false;generated=false;
 $('proposalStatus').textContent='';$('proposalHeading').focus({preventScroll:true});
 $('proposalPreview').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
}
function close(){
 $('proposalPreview').hidden=true;$('proposalResult').hidden=true;$('proposalForm').hidden=false;
 $('proposalForm').reset();$('proposalError').hidden=true;$('proposalStatus').textContent='';
 generated=false;$('openProposal').focus({preventScroll:true});
}
function generate(ev){
 ev.preventDefault();if(!validate())return;
 generated=true;renderResult();$('proposalForm').hidden=true;$('proposalResult').hidden=false;
 $('proposalResultTitle').setAttribute('tabindex','-1');$('proposalResultTitle').focus({preventScroll:true});
 $('proposalResult').scrollIntoView({behavior:'auto',block:'nearest'});
}
function edit(){
 $('proposalForm').hidden=false;$('proposalResult').hidden=true;generated=false;$('proposalStatus').textContent='';
 $('leadName').focus({preventScroll:true});
}
function fallbackCopy(content){
 const el=document.createElement('textarea');el.value=content;el.style.position='fixed';el.style.left='-9999px';document.body.append(el);
 el.select();let done=false;try{done=document.execCommand('copy')}catch(e){}
 el.remove();return done;
}
async function copy(){
 let success=false,contents=draftText();
 try{if(navigator.clipboard?.writeText&&window.isSecureContext){await navigator.clipboard.writeText(contents);success=true}}catch(e){}
 if(!success)success=fallbackCopy(contents);
 $('proposalStatus').textContent=success?dict().copied:dict().copyError;
}
function download(){
 const file=new Blob([draftText()],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(file);const link=document.createElement('a');
 link.href=url;link.download='KRM-proposal-demo.txt';document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 $('proposalStatus').textContent=dict().saved;
}
$('openProposal').addEventListener('click',open);
$('proposalCancel').addEventListener('click',close);
$('proposalForm').addEventListener('submit',generate);
$('proposalCopy').addEventListener('click',copy);
$('proposalDownload').addEventListener('click',download);
$('proposalBack').addEventListener('click',edit);
for(const id of ['leadName','leadEmail','leadCompany','leadMessage'])$(id).addEventListener('input',()=>{$('proposalError').hidden=true;$(id).removeAttribute('aria-invalid')});
$('leadDemoAck').addEventListener('change',()=>{$('proposalError').hidden=true});
$('restart').addEventListener('click',()=>{if($('proposalPreview').hidden)return;close()});
$('previous').addEventListener('click',()=>{if($('proposalPreview').hidden)return;close()});
const watcher=new MutationObserver(()=>translate());watcher.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
translate();
})();