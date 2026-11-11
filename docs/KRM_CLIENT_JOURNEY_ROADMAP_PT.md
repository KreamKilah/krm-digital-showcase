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
- [ ] **Fase 1 — Site multilingue**: selecionar DE (base), PT-PT e EN; tradução integral de navegação, textos, Experience Lab, gerador, mensagens de erro, resumo copiável e avisos. Guardar idioma escolhido e testar em telemóvel / computador.
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
