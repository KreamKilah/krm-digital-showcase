# KRM DIGITAL — Percurso do Cliente e Comercialização (v1)
Data: 11/11/2026
Estado: PLANO / documentação apenas. Nenhum formulário, envio de dados, cobrança, autenticação ou faturação real foi ativado por este documento.

## Visão
Transformar o portefólio KRM num sistema organizado de captação, proposta, produção e entrega de websites. Automatizar tarefas repetitivas, mantendo supervisão humana no design, preço, âmbito e publicação.

## Princípios
- O gerador de brief é gratuito e **não** cria automaticamente um contrato, encomenda ou fatura.
- Só enviar dados de contacto após ação explícita do utilizador e com informação de privacidade clara.
- Um pedido não é uma aceitação de proposta; uma proposta aceite não é uma confirmação de pagamento.
- A Client Space pública é uma **demo** sem contas reais ou dados privados; não usar para clientes reais até ter autenticação, controlo de acesso e armazenamento seguros.
- A IA pode sugerir arquitetura, textos e conceitos; uma pessoa revê design, conteúdos, acessibilidade, legalidade e qualidade.
- Nada de checkout / emissão de faturas reais até a atividade e as obrigações fiscais estarem regularizadas.

## Roadmap de implementação (por fases)
- [ ] **Fase 0 — Fundação legal e operações**: confirmar enquadramento (Gewerbe ou Freiberufler), registo fiscal, eventual Kleinunternehmerregelung, dados de faturação, conta bancária, impressum, política de privacidade, direitos de conteúdos, termos contratuais, política de cancelamento aplicável e conservação de documentos. Validar pontos fiscais com contabilista/Finanzamt.
- [x] **Fase 1 — Site multilingue**: selecionar DE (base), PT-PT e EN; tradução integral de navegação, textos, Experience Lab, gerador, mensagens de erro, resumo copiável e avisos. Guardar idioma escolhido e testar em telemóvel / computador.
- [ ] **Fase 2 — Brief Builder melhorado**: setor, objetivo, estilo, páginas, funcionalidades, exemplos de sites, marca/logótipo, conteúdos e imagens, domínio, idiomas, prazo, orçamento indicativo. Diferenciar obrigatórios de opcionais. Pré-visualização conceptual explicitamente não vinculativa.
- [ ] **Fase 3 — Pedido de proposta**: botão “Quero uma proposta”; formulário com nome/empresa, e-mail, dados do projeto, aceitação informada da política de privacidade; validação e anti-spam; confirmação de receção com referência interna (ex. KRM-REQ-0001), e-mail de receção **sem prometer aceitação**.
- [ ] **Fase 4 — Análise e orçamento**: análise humana, clarificações, proposta com âmbito, entregáveis, número de revisões, prazo estimado, preço, extras, custos recorrentes (domínio, alojamento, manutenção), responsabilidades por textos/imagens, critérios de aceitação, validade e condições de pagamento.
- [ ] **Fase 5 — Aceitação e contrato**: aceitação inequívoca da proposta e condições; verificar regras aplicáveis a contratos com consumidores, direito de retratação e tratamento de conteúdos digitais; criar projeto interno e marcos de execução. Só aqui formalizar a encomenda.
- [ ] **Fase 6 — Pagamento inicial**: na versão inicial, transferência bancária SEPA após proposta aceite e fatura adequada (adiantamento, se aplicável). Política comercial proposta: 50% no arranque + 50% antes da entrega final; ajustável conforme contrato. Conciliação manual do pagamento e confirmação; nunca marcar “pago” apenas porque o cliente clicou num botão.
- [ ] **Fase 7 — Produção na KRM**: recolha de conteúdos e acessos de forma segura, protótipo/design, desenvolvimento, responsividade, SEO básico conforme acordo, revisão e testes. IA usada como apoio com validação humana.
- [ ] **Fase 8 — Client Space privada**: projeto por cliente, marcos, ficheiros, feedback, histórico, aprovações e documentos de pagamento. Construir/validar login, permissões, privacidade, backups e segurança antes de abrir a clientes.
- [ ] **Fase 9 — Aprovação final e saldo**: revisão final registada, eventual fatura final com referência a adiantamentos, pagamento e confirmação financeira.
- [ ] **Fase 10 — Entrega e suporte**: deploy, acesso ao domínio/alojamento, transferência de credenciais por canal seguro, documentação, formação básica, período de correções e proposta opcional de manutenção.

## Documentos e eventos (não confundir)
1. **Confirmação de pedido**: “recebemos o teu briefing” + número de referência; não é fatura nem aceitação.
2. **Proposta / Angebot**: âmbito, preço, prazos e condições; ainda não há pagamento devido por mero envio do formulário.
3. **Aceitação / Auftrag**: confirmação de acordo nas condições; guardar registo.
4. **Fatura / Rechnung**: documento fiscal emitido no momento e formato legalmente adequados, incluindo para eventual adiantamento.
5. **Confirmação de pagamento / Zahlungsbestätigung**: enviada apenas após verificação da entrada do dinheiro; não substitui necessariamente a fatura.
6. **Fatura final / Schlussrechnung**: quando aplicável, detalha valor total e adiantamentos.
7. **Auto de entrega / Abnahme**: aprovação final e confirmação do trabalho executado, conforme contrato.

## Informação comercial a recolher
- Identificação e contacto; país; se cliente é empresa ou particular.
- Nome comercial e dados de faturação apenas quando necessários.
- Objetivo, público-alvo, tipo de site, páginas, funcionalidades, integrações, conteúdo, alojamento, domínio e línguas.
- Exemplos e preferências visuais, acessibilidade, requisitos de segurança, orçamento aproximado e prazo desejado.
- Autorizações / licenças de imagens, fontes, marcas e conteúdo fornecido.
- Privacidade: finalidade, base legal, prazo de conservação e prestadores utilizados, definidos na política de privacidade; recolher só o necessário.

## Faturação e pagamentos na Alemanha — verificar antes do lançamento
- Se KRM for elegível e optar por **Kleinunternehmerregelung (§19 UStG)**, não indicar IVA como valor separado na fatura. Incluir a menção de isenção e os dados mínimos do §34a UStDV (identidade/morada das partes, número fiscal admitido, data, serviço e valor). Numeração consistente é boa prática operacional.
- Segundo as regras desde 2025: referência geral a 25.000 € no ano anterior e 100.000 € no ano corrente; em ano de constituição existe regra própria de 25.000 €. Validar situação concreta com Finanzamt/Steuerberater.
- B2B doméstico: há regras de E-Rechnung e transição; Kleinunternehmer estão isentos de **emitir** E-Rechnung, mas devem poder **recebê-la**.
- Preferência inicial: fatura emitida por software de faturação compatível com a Alemanha, e transferência SEPA; não desenvolver “faturas” fiscais inventadas no front-end.
- Exemplificação comercial, NÃO preço fixado: projeto de 600 € → 300 € inicial + 300 € no final, se acordado no contrato. Os valores apresentados ao cliente têm de corresponder ao regime fiscal aplicável.
- Não armazenar dados de cartões no próprio website; gateway de pagamento só após revisão de compliance, privacidade e integração.

## Prioridades técnicas
**P0** — enquadramento legal e privacidade + tradução do portefólio.
**P1** — Brief detalhado + confirmação de pedido sem cobrança.
**P2** — propostas e aceitação com intervenção humana.
**P3** — faturação e transferências bancárias comprovadas.
**P4** — portal seguro para clientes reais.
**P5** — pagamentos online e automações mais avançadas.

## Fontes oficiais para consulta antes de faturar
- §34a UStDV: https://www.gesetze-im-internet.de/ustdv_1980/__34a.html
- BMF E-Rechnung FAQ (2026): https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html
- Portal federal de criação de empresas (impressum e privacidade): https://www.existenzgruendungsportal.de/Redaktion/DE/BMWK-Infopool/Antworten/E-Business/Recht-AGB/Webseite-Informationspflichten

**Nota:** plano técnico/comercial; não substitui aconselhamento jurídico ou contabilístico específico.

## Progresso confirmado — 11/11/2026
- Implementada seleção DE / PT-PT / EN no portefólio principal (ficheiros `index.html` e `i18n.js`).
- Traduções da interface pública, secções do portefólio, Experience Lab e gerador de brief; texto do resumo e cópia seguem o idioma selecionado.
- Idioma guardado no navegador. A navegação e o gerador não enviam dados do visitante.
- Teste automatizado Playwright/Chromium aprovado nas larguras 360, 390, 768 e 1440 px, com verificação de alterações DE/PT/EN, estado do gerador e ausência de scroll horizontal. Workflow: https://github.com/KreamKilah/krm-digital-showcase/actions/runs/43093755895
- Limitação: traduções aplicam-se à página principal do portefólio, **não** às páginas independentes NOVA, VANTA, ORLA ou à Client Space. Validação visual manual no dispositivo do cliente continua recomendada.
- Próxima execução: Fase 2 (brief mais detalhado), sem envio real de dados ou faturação até cumprir requisitos legais.

## Progresso da Fase 2 — 11/11/2026
- Criado o **Project Brief Studio** com cinco etapas, resumo e exportação local TXT. Código em [brief-builder/](../brief-builder/index.html).
- Entrada adicionada ao gerador rápido do portefólio; as opções de setor, estilo e objetivo são transmitidas por URL como escolhas predefinidas, sem dados pessoais.
- Campos para arquitetura, funcionalidades, conteúdos, logótipo, domínio, idiomas, prazo e orçamento orientativo. Dois campos obrigatórios (setor e objetivo); os restantes são opcionais.
- Traduções de interface e resumo em DE/PT-PT/EN, com adaptação responsiva e controlos acessíveis.
- Não há submissão, upload, conta de cliente, envio de e-mail ou cobrança. Os dados não ficam guardados após atualizar a página; apenas a preferência de idioma é persistida.
- Teste funcional automatizado adicionado ao workflow; **execução de CI/deploy ainda pendente no GitHub Actions** nesta atualização. Não marcar a fase como totalmente validada antes de o teste terminar com sucesso.
- Próximo ponto de decisão: definir política de privacidade e canal de contacto seguro antes de criar a Fase 3 (pedido real de proposta).

## Progresso da Fase 3 — 11/11/2026
- Integração de **pré-visualização de pedido de proposta** no ecrã final do Brief Builder, sem novo site ou formulário remoto.
- Demonstração dos campos de contacto: nome, e-mail, empresa, país, tipo de cliente, mensagem; validação local e aviso expresso de que **nada é enviado**.
- Pré-visualização do pedido completo e do possível e-mail de confirmação automática. Os estados posteriores são simulados: análise humana → proposta → aceitação → Client Space.
- Copiar/guardar TXT por ação do utilizador; ligação separada à Client Space **pública de demonstração**.
- Localização DE/PT-PT/EN e testes de browser adicionados, incluindo exportação, validação, XSS no resumo, ausência de pedidos POST e ausência de armazenamento persistente do conteúdo.
- **Fase 3 real permanece PENDENTE**: não existe endpoint privado, registo no servidor, ID real de pedido, notificação automática, consentimento para tratamento de dados validado ou fatura.
- Publicações recentes no GitHub Actions estão em fila e algumas tiveram startup_failure; **não tratar a demo como validada na produção** antes de confirmar o workflow e o site servido.
- Check-list para ativação real: [KRM_REQUEST_PREVIEW_PHASE3_PT.md](./KRM_REQUEST_PREVIEW_PHASE3_PT.md).

## Próximas prioridades
1. Resolver bloqueio de CI/GitHub Pages e executar testes finais em telemóvel/desktop.
2. Completar os dados e documentos legais da KRM para receber pedidos verdadeiros.
3. Implementar backend seguro de receção + estado + confirmação por e-mail, mantendo preços/aceitações sob revisão humana.
4. Integrar a administração privada e Client Space apenas após autenticação e permissões testadas.

## Decisão de estratégia — 11/11/2026: validar antes de registar
- O proprietário decidiu **adiar o registo formal da KRM** enquanto a ideia ainda está a ser preparada e testada.
- A KRM mantém-se, para já, em **modo de protótipo e validação**, sem pedidos comerciais ativos, contratos, cobrança, faturação ou tratamento de dados de clientes reais.
- Prioridade: concluir QA do site, briefing, demonstração de pedido e Client Space; recolher feedback de utilizadores em contexto não comercial e validar clareza, desempenho e design.
- **Não confundir primeiro cliente com começo da atividade comercial**: caso a atividade seja classificada como Gewerbe, o registo deve ocorrer aquando do início da atividade, não só quando houver receita; confirmar enquadramento exato e obrigações com Gewerbeamt/Finanzamt antes de começar a oferecer serviços comercialmente.
- Para comercializar: confirmar Gewerbe vs Freiberufler, completar Impressum e Datenschutz, formalizar propostas/contratos, ativar submissão segura, só então faturação/pagamentos.
- Referências oficiais: https://verwaltung.bund.de/leistungsverzeichnis/de/leistung/99050012104000 e https://www.existenzgruendungsportal.de/Redaktion/DE/BMWK-Infopool/Antworten/Gruendungsplanung/Gewerbe-Genehmigungen/Anmeldung/Gruendung-vorbereiten
