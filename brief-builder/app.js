(function () {
'use strict';
const I={
de:{
skip:'Zum Projektformular springen',headerCaption:'PROJECT BRIEF STUDIO / 2026',backSite:'ZUR WEBSITE ↗',topNotice:'KOSTENLOSER KONZEPT-ENTWURF · KEINE ANFRAGE · KEINE ZAHLUNG',
kicker:'01 / VON DER IDEE ZUR RICHTUNG',hero1:'YOUR IDEA.',hero2:'OUR NEXT',hero3:'WORLD.',heroDesc:'Erzähl uns, wie deine digitale Marke aussehen könnte. Fünf kurze Schritte machen aus einer groben Idee ein konkretes Kreativ-Briefing.',
s1title:'DIE MARKE.',s1desc:'Wer bist du und was soll deine Website erreichen? Nur zwei Entscheidungen sind erforderlich.',brandLabel:'Marken- oder Projektname (optional)',brandPh:'z. B. KRM Studio',brandHelp:'Du kannst den Namen auch später festlegen.',industryLabel:'01 — BRANCHE *',goalLabel:'02 — HAUPTZIEL *',audienceLabel:'Für wen ist die Website? (optional)',audiencePh:'Wer sind deine idealen Kunden?',
s2title:'DIE ATMOSPHÄRE.',s2desc:'Wähle eine visuelle Richtung. Alle Angaben können später verfeinert werden.',moodLabel:'STILRICHTUNG',paletteLabel:'FARBWELT',referenceLabel:'Inspiration / Referenz-Website (optional)',referencePh:'https://example.com',referenceHelp:'Bitte nur einen öffentlich erreichbaren Link eintragen. Keine Zugangsdaten.',visualNotesLabel:'Was soll das Design ausstrahlen? (optional)',visualNotesPh:'Eine prägnante, persönliche Atmosphäre…',
s3title:'DIE ERFAHRUNG.',s3desc:'Wähle Seiten und Funktionen. Das ist eine Wunschliste, kein bestätigter Leistungsumfang.',pagesLabel:'WELCHE SEITEN?',featuresLabel:'WELCHE FUNKTIONEN?',scopeWarning:'Buchungen, Shop, Mehrsprachigkeit oder Integrationen können zusätzlichen Aufwand und laufende Kosten verursachen. Wir prüfen den Umfang später individuell.',featuresNotesLabel:'Besondere Anforderungen (optional)',featuresNotesPh:'Integrationen, Abläufe, spezielle Seiten…',
s4title:'DER FAHRPLAN.',s4desc:'Inhalte, Domain und Rahmenbedingungen — damit ein späteres Angebot realistisch wird.',contentLabel:'INHALTE & BILDER',logoLabel:'LOGO / MARKENIDENTITÄT',domainLabel:'DOMAIN & HOSTING',langLabel:'SPRACHEN DER ZUKÜNFTIGEN WEBSITE',timelineLabel:'WUNSCHTERMIN',budgetLabel:'ORIENTIERUNGSBUDGET',budgetWarning:'Das Budget ist nur deine grobe Orientierung und kein Angebot oder verbindlicher Preis.',extraNotesLabel:'Sonstige Wünsche und Fragen (optional)',extraNotesPh:'Weitere Informationen…',
s5title:'DEIN BRIEF.',s5desc:'Hier ist dein Konzept-Dokument. Du kannst es kopieren oder als Textdatei herunterladen und später teilen.',resultTag:'ENTWURF — NICHT VERBINDLICH',resultTitle:'DEINE DIGITALE RICHTUNG.',finalDisclaimer:'Kein Angebot, keine Bestellung, kein Vertrag. Dieses Dokument wurde ausschließlich in deinem Browser erstellt; es wurde nichts an KRM gesendet.',copy:'BRIEF KOPIEREN ↗',download:'ALS .TXT SPEICHERN ↓',previous:'← ZURÜCK',next:'WEITER ↗',restart:'NEU BEGINNEN ↺',
asideKicker:'LIVE PROJECT SNAPSHOT',brandAside:'DEINE MARKE',industryAside:'BRANCHE',goalAside:'ZIEL',moodAside:'DESIGN',pagesAside:'SEITEN',budgetAside:'BUDGET',asideNoteTitle:'YOUR VISION / IN MOTION',asideNote:'Alles bleibt in deinem Browser, bis du selbst entscheidest, den Brief zu kopieren oder herunterzuladen.',footerNote:'KONZEPT-TOOL / KEINE ANFRAGE ODER ZAHLUNG',footerBack:'ZURÜCK ZUM PORTFOLIO ↗',
steps:['Marke','Design','Website','Plan','Brief'],
fields:['Projektname','Branche','Hauptziel','Zielgruppe','Designstil','Farbwelt','Referenz-Link','Gestaltungsnotizen','Gewünschte Seiten','Gewünschte Funktionen','Besondere Anforderungen','Inhalte und Bilder','Logo','Domain und Hosting','Website-Sprachen','Wunschtermin','Orientierungsbudget','Weitere Hinweise'],
missing:'Noch offen',noneSelected:'Noch nicht gewählt',pageCount:'Seiten ausgewählt',requiredError:'Wähle bitte eine Branche und ein Hauptziel, um fortzufahren.',urlError:'Bitte eine gültige URL mit https:// oder http:// eingeben oder das Feld leer lassen.',copied:'✓ Brief in die Zwischenablage kopiert.',copyError:'Kopieren nicht möglich. Bitte nutze den Download.',downloaded:'✓ Textdatei zum Speichern vorbereitet.',resetConfirm:'Möchtest du alle Eingaben zurücksetzen? Der Text wird nicht gespeichert.',documentTitle:'KRM DIGITAL — KREATIV-BRIEF',conceptOnly:'UNVERBINDLICHER ENTWURF — keine Anfrage, kein Auftrag, kein Preisangebot. Nicht an KRM gesendet.',notProvided:'Nicht angegeben',skipOption:'Zur Besprechung',
options:{
industry:{restaurant:'Restaurant / Café',barber:'Barber / Beauty',automotive:'Automotive',property:'Immobilien',retail:'Shop / Handel',services:'Dienstleistungen',other:'Andere Branche'},
goal:{presence:'Marke präsentieren',leads:'Kundenanfragen erhalten',booking:'Buchungen ermöglichen',showcase:'Produkte / Arbeiten zeigen',sales:'Online-Verkäufe',inform:'Information bereitstellen'},
mood:{luxury:'Luxuriös',bold:'Mutig / Ausdrucksstark',minimal:'Minimalistisch',editorial:'Editorial',playful:'Lebendig',warm:'Warm / Natürlich'},
palette:{dark:'Dunkel & Edel',light:'Hell & Klar',earth:'Erdfarben',vivid:'Kräftige Farben',mono:'Monochrom',surprise:'KRM entscheidet'},
pages:{home:'Startseite',about:'Über uns',services:'Services / Produkte',portfolio:'Portfolio',gallery:'Galerie',menu:'Speisekarte',booking:'Buchung',shop:'Shop',blog:'Blog',faq:'FAQ',contact:'Kontakt'},
features:{contactForm:'Kontaktformular',bookingSystem:'Buchungssystem',shopCart:'Online-Shop',cms:'Inhalte selbst ändern',multiLang:'Mehrsprachig',maps:'Karte / Standort',animations:'Animationen',seo:'SEO-Grundlagen',gallery:'Bildergalerie',social:'Social Links',newsletter:'Newsletter',analytics:'Besucherstatistik'},
content:{ready:'Alles vorhanden',partial:'Teilweise vorhanden',help:'Texte / Bilder werden benötigt'},
logo:{ready:'Logo vorhanden',refresh:'Überarbeitung erwünscht',new:'Logo benötigt'},
domain:{ready:'Domain / Hosting vorhanden',domainOnly:'Nur Domain vorhanden',help:'Beratung benötigt'},
siteLang:{de:'Deutsch',en:'Englisch',pt:'Portugiesisch',es:'Spanisch',other:'Weitere'},
timeline:{flex:'Flexibel',soon:'2–4 Wochen',normal:'1–2 Monate',date:'Bestimmter Termin'},
budget:{unknown:'Noch offen',low:'Bis 300 €',mid:'300–600 €',high:'600–1.200 €',premium:'Über 1.200 €'}
}},
pt:{
skip:'Ir para o briefing',headerCaption:'ESTÚDIO DE BRIEFING / 2026',backSite:'VOLTAR AO SITE ↗',topNotice:'CONCEITO GRATUITO · NÃO É UM PEDIDO · SEM PAGAMENTOS',
kicker:'01 / DA IDEIA À VISÃO',hero1:'A TUA IDEIA.',hero2:'O PRÓXIMO',hero3:'UNIVERSO.',heroDesc:'Conta-nos como imaginas a tua marca digital. Cinco passos transformam uma ideia num briefing criativo e organizado.',
s1title:'A MARCA.',s1desc:'Quem és e o que queres alcançar? Apenas duas escolhas são obrigatórias.',brandLabel:'Nome da marca ou projeto (opcional)',brandPh:'Ex.: KRM Studio',brandHelp:'Podes decidir o nome mais tarde.',industryLabel:'01 — SETOR *',goalLabel:'02 — OBJETIVO PRINCIPAL *',audienceLabel:'A quem se destina o site? (opcional)',audiencePh:'Quem são os teus clientes ideais?',
s2title:'A ATMOSFERA.',s2desc:'Escolhe uma direção visual. Podemos aperfeiçoar todos os detalhes mais tarde.',moodLabel:'ESTILO VISUAL',paletteLabel:'CORES PREFERIDAS',referenceLabel:'Inspiração / site de referência (opcional)',referencePh:'https://exemplo.com',referenceHelp:'Usa apenas um endereço público. Não coloques credenciais de acesso.',visualNotesLabel:'O que queres transmitir com o design? (opcional)',visualNotesPh:'Uma atmosfera marcante, pessoal…',
s3title:'A EXPERIÊNCIA.',s3desc:'Escolhe páginas e funcionalidades. É uma lista de ideias, não um compromisso de entrega.',pagesLabel:'QUE PÁGINAS PRECISAS?',featuresLabel:'QUE FUNCIONALIDADES QUERES?',scopeWarning:'Reservas, lojas, vários idiomas ou integrações podem aumentar a complexidade e os custos recorrentes. Tudo será avaliado antes de qualquer proposta.',featuresNotesLabel:'Requisitos especiais (opcional)',featuresNotesPh:'Integrações, processos, páginas específicas…',
s4title:'O PLANO.',s4desc:'Conteúdos, domínio e expectativas — para um futuro orçamento realista.',contentLabel:'TEXTOS E IMAGENS',logoLabel:'LOGÓTIPO / IDENTIDADE',domainLabel:'DOMÍNIO E ALOJAMENTO',langLabel:'IDIOMAS DO FUTURO SITE',timelineLabel:'PRAZO PRETENDIDO',budgetLabel:'ORÇAMENTO INDICATIVO',budgetWarning:'Este orçamento é apenas uma referência da tua disponibilidade, não é um preço nem uma proposta da KRM.',extraNotesLabel:'Outras ideias e dúvidas (opcional)',extraNotesPh:'Mais informações…',
s5title:'O TEU BRIEF.',s5desc:'Este é o resumo do teu projeto. Podes copiá-lo ou guardar um ficheiro de texto para partilhar mais tarde.',resultTag:'RASCUNHO — SEM COMPROMISSO',resultTitle:'A TUA DIREÇÃO DIGITAL.',finalDisclaimer:'Não é um orçamento, uma encomenda nem um contrato. O documento foi criado apenas no teu navegador; nenhum dado foi enviado à KRM.',copy:'COPIAR BRIEF ↗',download:'GUARDAR .TXT ↓',previous:'← ANTERIOR',next:'CONTINUAR ↗',restart:'COMEÇAR DE NOVO ↺',
asideKicker:'PRÉ-VISUALIZAÇÃO DO PROJETO',brandAside:'A TUA MARCA',industryAside:'SETOR',goalAside:'OBJETIVO',moodAside:'ESTILO',pagesAside:'PÁGINAS',budgetAside:'ORÇAMENTO',asideNoteTitle:'A TUA VISÃO / EM CONSTRUÇÃO',asideNote:'Os detalhes ficam no teu navegador. Só os partilhas se decidires copiar ou guardar o briefing.',footerNote:'GERADOR DE CONCEITOS / SEM PEDIDOS OU PAGAMENTOS',footerBack:'VOLTAR AO PORTEFÓLIO ↗',
steps:['Marca','Design','Site','Plano','Resumo'],
fields:['Nome do projeto','Setor','Objetivo principal','Público-alvo','Estilo visual','Cores','Site de referência','Notas visuais','Páginas pretendidas','Funcionalidades pretendidas','Requisitos especiais','Textos e imagens','Logótipo','Domínio e alojamento','Idiomas do site','Prazo desejado','Orçamento indicativo','Notas adicionais'],
missing:'Por definir',noneSelected:'Ainda não escolhido',pageCount:'páginas selecionadas',requiredError:'Seleciona um setor e um objetivo principal para continuares.',urlError:'Introduz um endereço válido com https:// ou http:// ou deixa o campo vazio.',copied:'✓ Brief copiado.',copyError:'Não foi possível copiar. Usa a opção para guardar o ficheiro.',downloaded:'✓ Ficheiro de texto preparado.',resetConfirm:'Queres apagar todas as escolhas? Os dados não são guardados.',documentTitle:'KRM DIGITAL — BRIEF CRIATIVO',conceptOnly:'CONCEITO NÃO VINCULATIVO — não é pedido, contrato ou orçamento. Nada foi enviado à KRM.',notProvided:'Não indicado',skipOption:'A definir em conversa',
options:{
industry:{restaurant:'Restaurante / Café',barber:'Barbearia / Beleza',automotive:'Automóvel',property:'Imobiliário',retail:'Loja / Comércio',services:'Serviços',other:'Outro setor'},
goal:{presence:'Apresentar a marca',leads:'Receber contactos',booking:'Permitir reservas',showcase:'Mostrar produtos / trabalhos',sales:'Vender online',inform:'Informar clientes'},
mood:{luxury:'Luxuoso',bold:'Arrojado',minimal:'Minimalista',editorial:'Editorial',playful:'Dinâmico',warm:'Acolhedor / Natural'},
palette:{dark:'Escuro e elegante',light:'Claro e limpo',earth:'Tons terra',vivid:'Cores vibrantes',mono:'Monocromático',surprise:'KRM escolhe'},
pages:{home:'Página inicial',about:'Sobre nós',services:'Serviços / Produtos',portfolio:'Portefólio',gallery:'Galeria',menu:'Menu',booking:'Reservas',shop:'Loja',blog:'Blog',faq:'Perguntas frequentes',contact:'Contacto'},
features:{contactForm:'Formulário de contacto',bookingSystem:'Sistema de reservas',shopCart:'Loja online',cms:'Editar conteúdos',multiLang:'Vários idiomas',maps:'Mapa / Localização',animations:'Animações',seo:'SEO básico',gallery:'Galeria de imagens',social:'Redes sociais',newsletter:'Newsletter',analytics:'Estatísticas'},
content:{ready:'Já tenho tudo',partial:'Tenho parte do conteúdo',help:'Preciso de textos / imagens'},
logo:{ready:'Já tenho logótipo',refresh:'Quero modernizar',new:'Preciso de logótipo'},
domain:{ready:'Já tenho domínio e alojamento',domainOnly:'Tenho apenas domínio',help:'Preciso de ajuda'},
siteLang:{de:'Alemão',en:'Inglês',pt:'Português',es:'Espanhol',other:'Outro idioma'},
timeline:{flex:'Flexível',soon:'2–4 semanas',normal:'1–2 meses',date:'Data específica'},
budget:{unknown:'Por definir',low:'Até 300 €',mid:'300–600 €',high:'600–1.200 €',premium:'Mais de 1.200 €'}
}},
en:{
skip:'Skip to the briefing',headerCaption:'PROJECT BRIEF STUDIO / 2026',backSite:'BACK TO WEBSITE ↗',topNotice:'FREE CONCEPT · NOT A REQUEST · NO PAYMENTS',
kicker:'01 / FROM IDEA TO DIRECTION',hero1:'YOUR IDEA.',hero2:'OUR NEXT',hero3:'WORLD.',heroDesc:'Tell us how you imagine your digital brand. Five short steps turn an idea into an organized creative brief.',
s1title:'THE BRAND.',s1desc:'Who are you and what should your website achieve? Only two choices are required.',brandLabel:'Brand or project name (optional)',brandPh:'e.g. KRM Studio',brandHelp:'You can decide on a name later.',industryLabel:'01 — INDUSTRY *',goalLabel:'02 — MAIN GOAL *',audienceLabel:'Who is the website for? (optional)',audiencePh:'Who are your ideal customers?',
s2title:'THE FEELING.',s2desc:'Choose a visual direction. Every detail can be refined later.',moodLabel:'VISUAL STYLE',paletteLabel:'COLOR PALETTE',referenceLabel:'Inspiration / reference website (optional)',referencePh:'https://example.com',referenceHelp:'Use a public website link only. Never enter passwords.',visualNotesLabel:'What should the design communicate? (optional)',visualNotesPh:'A distinctive, personal atmosphere…',
s3title:'THE EXPERIENCE.',s3desc:'Choose pages and features. This is a wish list, not a confirmed scope of work.',pagesLabel:'WHICH PAGES?',featuresLabel:'WHICH FEATURES?',scopeWarning:'Bookings, shops, multiple languages and integrations may increase complexity and ongoing costs. Scope will be reviewed before any proposal.',featuresNotesLabel:'Special requirements (optional)',featuresNotesPh:'Integrations, workflows, special pages…',
s4title:'THE PLAN.',s4desc:'Content, domain and expectations — to make any later quote realistic.',contentLabel:'TEXT AND IMAGES',logoLabel:'LOGO / BRAND IDENTITY',domainLabel:'DOMAIN & HOSTING',langLabel:'LANGUAGES FOR YOUR WEBSITE',timelineLabel:'PREFERRED TIMELINE',budgetLabel:'INDICATIVE BUDGET',budgetWarning:'This budget is only your planning range, not a quote or binding KRM price.',extraNotesLabel:'Other ideas or questions (optional)',extraNotesPh:'Anything else…',
s5title:'YOUR BRIEF.',s5desc:'Here is your project summary. Copy it or save a text file to share later.',resultTag:'DRAFT — NON-BINDING',resultTitle:'YOUR DIGITAL DIRECTION.',finalDisclaimer:'Not a quote, order or contract. This document was created only in your browser; nothing was sent to KRM.',copy:'COPY BRIEF ↗',download:'SAVE AS .TXT ↓',previous:'← BACK',next:'CONTINUE ↗',restart:'START AGAIN ↺',
asideKicker:'LIVE PROJECT SNAPSHOT',brandAside:'YOUR BRAND',industryAside:'INDUSTRY',goalAside:'MAIN GOAL',moodAside:'STYLE',pagesAside:'PAGES',budgetAside:'BUDGET',asideNoteTitle:'YOUR VISION / IN MOTION',asideNote:'Details stay in your browser. You only share them if you decide to copy or save the brief.',footerNote:'CONCEPT TOOL / NO REQUESTS OR PAYMENTS',footerBack:'BACK TO PORTFOLIO ↗',
steps:['Brand','Design','Website','Plan','Brief'],
fields:['Project name','Industry','Main goal','Target audience','Visual style','Color palette','Reference website','Visual notes','Preferred pages','Preferred features','Special requirements','Text and images','Logo','Domain and hosting','Site languages','Preferred timeline','Indicative budget','Additional notes'],
missing:'To be decided',noneSelected:'Not selected yet',pageCount:'pages selected',requiredError:'Choose an industry and a main goal to continue.',urlError:'Please enter a valid URL starting with https:// or http://, or leave it blank.',copied:'✓ Brief copied.',copyError:'Could not copy. Please use the download option.',downloaded:'✓ Text file ready to save.',resetConfirm:'Clear all your choices? The data is not stored.',documentTitle:'KRM DIGITAL — CREATIVE BRIEF',conceptOnly:'NON-BINDING CONCEPT — not a request, order, contract or price quote. Nothing was sent to KRM.',notProvided:'Not provided',skipOption:'To discuss',
options:{
industry:{restaurant:'Restaurant / Café',barber:'Barber / Beauty',automotive:'Automotive',property:'Real Estate',retail:'Store / Retail',services:'Services',other:'Other industry'},
goal:{presence:'Present my brand',leads:'Get inquiries',booking:'Enable bookings',showcase:'Show products / work',sales:'Sell online',inform:'Inform customers'},
mood:{luxury:'Luxury',bold:'Bold',minimal:'Minimal',editorial:'Editorial',playful:'Playful',warm:'Warm / Natural'},
palette:{dark:'Dark & elegant',light:'Light & clean',earth:'Earthy tones',vivid:'Vibrant colors',mono:'Monochrome',surprise:'KRM picks'},
pages:{home:'Home',about:'About',services:'Services / Products',portfolio:'Portfolio',gallery:'Gallery',menu:'Menu',booking:'Booking',shop:'Shop',blog:'Blog',faq:'FAQ',contact:'Contact'},
features:{contactForm:'Contact form',bookingSystem:'Booking system',shopCart:'Online shop',cms:'Edit content',multiLang:'Multilingual',maps:'Map / Location',animations:'Animations',seo:'Basic SEO',gallery:'Photo gallery',social:'Social links',newsletter:'Newsletter',analytics:'Analytics'},
content:{ready:'Everything is ready',partial:'Some content is ready',help:'Need text / images'},
logo:{ready:'Logo is ready',refresh:'Need a refresh',new:'Need a logo'},
domain:{ready:'Domain and hosting ready',domainOnly:'Only domain ready',help:'Need guidance'},
siteLang:{de:'German',en:'English',pt:'Portuguese',es:'Spanish',other:'Other language'},
timeline:{flex:'Flexible',soon:'2–4 weeks',normal:'1–2 months',date:'Specific date'},
budget:{unknown:'Not sure yet',low:'Up to €300',mid:'€300–€600',high:'€600–€1,200',premium:'Over €1,200'}
}}
};
const defs={
industry:['restaurant','barber','automotive','property','retail','services','other'],
goal:['presence','leads','booking','showcase','sales','inform'],
mood:['luxury','bold','minimal','editorial','playful','warm'],
palette:['dark','light','earth','vivid','mono','surprise'],
pages:['home','about','services','portfolio','gallery','menu','booking','shop','blog','faq','contact'],
features:['contactForm','bookingSystem','shopCart','cms','multiLang','maps','animations','seo','gallery','social','newsletter','analytics'],
content:['ready','partial','help'],logo:['ready','refresh','new'],domain:['ready','domainOnly','help'],
siteLang:['de','en','pt','es','other'],timeline:['flex','soon','normal','date'],budget:['unknown','low','mid','high','premium']
};
const multiple=new Set(['pages','features','siteLang']);
const swatches={dark:'linear-gradient(90deg,#08090e,#484157)',light:'linear-gradient(90deg,#f7f3e9,#d4bca8)',earth:'linear-gradient(90deg,#9e7155,#506c54)',vivid:'linear-gradient(90deg,#e65f4c,#743aff)',mono:'linear-gradient(90deg,#08090e,#fafafa)',surprise:'linear-gradient(90deg,#ff806c,#8675ff)'};
const state={step:0,lang:'de',brandName:'',industry:null,goal:null,audience:'',mood:null,palette:null,references:'',visualNotes:'',pages:new Set(),features:new Set(),featuresNotes:'',content:null,logo:null,domain:null,siteLang:new Set(),timeline:null,budget:null,extraNotes:''};
const $=id=>document.getElementById(id);
const fieldPairs=[['brandName'],['industry'],['goal'],['audience'],['mood'],['palette'],['references'],['visualNotes'],['pages'],['features'],['featuresNotes'],['content'],['logo'],['domain'],['siteLang'],['timeline'],['budget'],['extraNotes']];
const outputKeys=fieldPairs.map(x=>x[0]);
function t(key){return I[state.lang][key]}
function optionLabel(group,key){return key?I[state.lang].options[group][key]:t('noneSelected')}
function readable(group){const value=state[group];return multiple.has(group)?value.size?[...value].map(key=>optionLabel(group,key)).join(', '):t('noneSelected'):value?optionLabel(group,value):t('noneSelected')}
function renderOptions(){
  for(const [group,keys] of Object.entries(defs)){
    const parent=$(group+'Options');parent.replaceChildren();
    for(const key of keys){
      const button=document.createElement('button');button.type='button';
      button.dataset.option=key;button.dataset.group=group;
      const selected=multiple.has(group)?state[group].has(key):state[group]===key;
      button.setAttribute('aria-pressed',String(selected));
      const label=document.createElement('span');label.className='option-label';label.textContent=optionLabel(group,key);
      if(group==='palette'){const swatch=document.createElement('span');swatch.className='palette-dot';swatch.style.setProperty('--palette',swatches[key]);swatch.setAttribute('aria-hidden','true');label.prepend(swatch)}
      button.appendChild(label);
      button.addEventListener('click',()=>{
        if(multiple.has(group)){if(state[group].has(key))state[group].delete(key);else state[group].add(key)}
        else state[group]=state[group]===key?null:key;
        renderOptions();updateAside();if(state.step===4)renderSummary();
        $('validationError').hidden=true;
      });
      parent.appendChild(button);
    }
  }
}
function translate(){
  document.documentElement.lang=state.lang==='pt'?'pt-PT':state.lang;
  for(const el of document.querySelectorAll('[data-i]'))el.textContent=t(el.dataset.i);
  for(const el of document.querySelectorAll('[data-ph]'))el.setAttribute('placeholder',t(el.dataset.ph));
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.lang===state.lang)));
  document.title='KRM DIGITAL® — '+({de:'Projekt-Brief',pt:'Briefing de Website',en:'Website Project Brief'}[state.lang]);
  renderOptions();renderNav();updateAside();if(state.step===4)renderSummary();
  try{localStorage.setItem('krm-site-language',state.lang)}catch(err){}
}
function renderNav(){
  const nav=$('stepNav');nav.replaceChildren();
  I[state.lang].steps.forEach((label,i)=>{
    const btn=document.createElement('button');btn.type='button';
    const num=document.createElement('span');num.className='step-digit';num.textContent=String(i+1).padStart(2,'0');
    const name=document.createElement('span');name.className='step-label';name.textContent=label;
    btn.append(num,name);btn.setAttribute('aria-label',String(i+1)+': '+label);
    if(state.step===i)btn.setAttribute('aria-current','step');
    btn.addEventListener('click',()=>setStep(i));nav.appendChild(btn);
  });
}
function updateAside(){
  $('snapBrand').textContent=state.brandName.trim()||t('missing');
  $('snapIndustry').textContent=readable('industry');
  $('snapGoal').textContent=readable('goal');
  $('snapMood').textContent=readable('mood');
  $('snapPages').textContent=state.pages.size+' '+t('pageCount');
  $('snapBudget').textContent=readable('budget');
}
function validReference(){
  const value=state.references.trim();
  if(!value)return true;
  try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&!!url.hostname}
  catch(err){return false}
}
function showValidation(message,focusTarget){
  const el=$('validationError');el.textContent=message;el.hidden=false;
  if(focusTarget)$(focusTarget).focus();
  else el.scrollIntoView({block:'center',behavior:'auto'});
}
function setStep(next){
  if(next<0||next>4)return;
  if(next>0&&(!state.industry||!state.goal)){
    if(state.step!==0){state.step=0;renderStage()}
    showValidation(t('requiredError'));return;
  }
  if((next>1||state.step===1&&next>1)&&!validReference()){
    state.step=1;renderStage();$('references').setAttribute('aria-invalid','true');
    showValidation(t('urlError'),'references');return;
  }
  state.step=next;renderStage();
  if(next===4)renderSummary();
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)window.scrollTo({top:Math.max(0,document.querySelector('.step-progress').getBoundingClientRect().top+window.scrollY-20),behavior:'smooth'});
  else window.scrollTo(0,Math.max(0,document.querySelector('.step-progress').getBoundingClientRect().top+window.scrollY-20));
  const title=document.querySelector('.stage[data-step="'+next+'"] h2');if(title)title.focus({preventScroll:true});
}
function renderStage(){
  document.querySelectorAll('.stage').forEach(el=>el.hidden=Number(el.dataset.step)!==state.step);
  $('validationError').hidden=true;$('references').removeAttribute('aria-invalid');
  $('previous').disabled=state.step===0;
  $('next').hidden=state.step===4;
  $('restart').hidden=state.step!==4;
  const percent=(state.step+1)*20;
  $('stepCount').textContent=String(state.step+1).padStart(2,'0')+' / 05';
  $('progressLabel').textContent=percent+'%';
  $('progressFill').style.width=percent+'%';
  $('progressTrack').setAttribute('aria-valuenow',String(percent));
  renderNav();updateAside();
}
function reportRows(){
  return outputKeys.map((key,index)=>{
    let value;
    if(defs[key])value=readable(key);
    else value=state[key].trim()||t('notProvided');
    return {name:t('fields')[index],value};
  });
}
function renderSummary(){
  const list=$('finalSummary');list.replaceChildren();
  const dl=document.createElement('dl');dl.style.margin='0';
  for(const row of reportRows()){
    const wrapper=document.createElement('div');wrapper.className='result-row';
    const dt=document.createElement('dt');dt.textContent=row.name;
    const dd=document.createElement('dd');dd.textContent=row.value;
    wrapper.append(dt,dd);dl.appendChild(wrapper);
  }
  list.appendChild(dl);
}
function briefText(){
  const rows=reportRows().map(row=>row.name+': '+row.value).join('\n');
  return t('documentTitle')+'\n'+'='.repeat(37)+'\n\n'+rows+'\n\n'+t('conceptOnly')+'\n';
}
function filename(){
  const safe=(state.brandName||'project').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48)||'project';
  return 'KRM-brief-'+safe+'.txt';
}
function copyFallback(text){
  const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();
  let success=false;try{success=document.execCommand('copy')}catch(err){}
  ta.remove();return success;
}
async function copyBrief(){
  const content=briefText();let ok=false;
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(content);ok=true}}
  catch(err){}
  if(!ok)ok=copyFallback(content);
  $('exportStatus').textContent=ok?t('copied'):t('copyError');
}
function downloadBrief(){
  const blob=new Blob([briefText()],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  a.href=url;a.download=filename();document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
  $('exportStatus').textContent=t('downloaded');
}
function resetBrief(){
  if(!confirm(t('resetConfirm')))return;
  document.querySelectorAll('#briefForm input,#briefForm textarea').forEach(el=>el.value='');
  for(const key of Object.keys(defs)){state[key]=multiple.has(key)?new Set():null}
  for(const key of ['brandName','audience','references','visualNotes','featuresNotes','extraNotes'])state[key]='';
  state.step=0;$('exportStatus').textContent='';
  renderOptions();renderStage();window.scrollTo({top:0,behavior:'auto'});
}
document.querySelectorAll('#briefForm input,#briefForm textarea').forEach(el=>{
  el.addEventListener('input',()=>{state[el.id]=el.value;updateAside();$('validationError').hidden=true;el.removeAttribute('aria-invalid')});
});
document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',()=>{state.lang=el.dataset.lang;translate()}));
$('next').addEventListener('click',()=>setStep(state.step+1));
$('previous').addEventListener('click',()=>setStep(state.step-1));
$('copy').addEventListener('click',copyBrief);
$('download').addEventListener('click',downloadBrief);
$('restart').addEventListener('click',resetBrief);
$('briefForm').addEventListener('submit',e=>e.preventDefault());
try{const saved=localStorage.getItem('krm-site-language');if(['de','pt','en'].includes(saved))state.lang=saved}catch(err){}
translate();renderStage();
})();