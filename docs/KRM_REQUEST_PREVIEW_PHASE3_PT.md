# KRM DIGITAL — Fase 3: pedidos de proposta e confirmação (pré-visualização)

Data: 11/11/2026
Estado: **UI DEMO IMPLEMENTADA; ENVIO REAL DESATIVADO; TESTES END-TO-END NO GITHUB AINDA PENDENTES.**

## O que está implementado
- O **Project Brief Studio** inclui, no ecrã final, uma entrada «Testar pedido de proposta».
- Abre um segundo painel na **mesma página e no mesmo separador**, preservando o briefing sem o enviar ou guardar.
- Formulário de simulação com nome, e-mail, empresa (opcional), país, tipo de cliente e mensagem opcional.
- Validação local de nome, e-mail e confirmação explícita de entendimento de que é DEMO.
- Pré-visualização do pedido, com dados de contacto e **briefing completo expansível**, e fluxo visual dos marcos: pedido → análise humana → proposta → aprovação e Client Space.
- Texto de **exemplo de e-mail automático de receção**, sem enviar e-mail.
- Exportação **local** do pedido em TXT e opção de copiar. É um rascunho claramente marcado **NÃO ENVIADO**.
- Ligação à **Client Space pública de demonstração**, sem prometer conta real nem associar dados do utilizador.
- DE / PT-PT / EN, incluindo as mensagens de erro, exportação, confirmação e notas de privacidade.

## O que NÃO está implementado
- Nenhum envio real, API, endpoint, base de dados, código de pedido verdadeiro, conta, autenticação ou painel administrativo privado.
- Nenhuma notificação real por e-mail, criação de faturas, cálculo automático de preço, reserva de horário ou cobrança.
- Sem envio de dados a terceiros pelo código do painel. Existem recursos visuais/fontes externos na página principal; devem ser analisados na política de privacidade antes da entrada em produção.
- Os campos de contacto e do briefing **não** são persistidos em localStorage/sessionStorage. O único valor guardado é o idioma do site; o conteúdo introduzido só existe na memória do separador e nos ficheiros que o próprio visitante decidir exportar.
- Não há «consentimento RGPD» fingido; a confirmação usada na DEMO diz apenas que o visitante entende que nada será submetido.

## Passos obrigatórios antes de ativar um pedido real
1. **Informação jurídica**: confirmar titular da atividade, enquadramento legal na Alemanha, Impressum, Datenschutzerklärung, política de conservação e contratos. Revisão especializada antes da publicação comercial.
2. **Canal seguro**: API HTTPS do lado do servidor num serviço contratado, nunca credenciais/API keys no repositório GitHub Pages. Avaliar alojamento e prestadores com acordos de tratamento de dados adequados.
3. **Proteção de formulário**: validação no servidor, limites por campo, rate limiting, defesa anti-spam, proteção contra abusos e pedidos duplicados, logs sem conteúdo sensível.
4. **Persistência mínima**: guardar apenas os dados necessários ao pedido e as preferências de contacto; acesso restrito por papéis e mecanismo de remoção/retificação.
5. **Estados de negócio**: recebido → a analisar → falta informação → proposta enviada → aceite/recusado → projeto criado → em desenvolvimento → entregue/arquivado. A mudança de estado exige ação ou evidência real: **não** marcar «recebido» se o servidor não tiver guardado o pedido.
6. **Referência do pedido**: gerada no servidor (exemplo KRM-REQ-2026-0001), nunca apresentada como número verdadeiro na demonstração.
7. **E-mails**: confirmação de receção apenas após gravação bem-sucedida; notificação interna; validação da entrega do fornecedor de e-mail; mensagens em DE/PT/EN, com opt-out onde aplicável.
8. **Proposta humana**: análise manual do âmbito, prazo, extras e custos recorrentes; enviar proposta antes de qualquer obrigação de pagamento.
9. **Aceitação formal**: termos e contrato, verificação do regime consumidor/empresa; só depois preparar faturação/adiantamento e, se necessário, criar acesso à **Client Space privada**.
10. **QA e revisão de segurança**: testes de sucesso, falha, duplicação, consentimento, autorização, anexos e privacidade; só então retirar o rótulo DEMO.

## Estrutura de futuro payload (exemplo técnico — NÃO ATIVO)
- client: nome, email, empresa (opcional), país, tipo de cliente.
- brief: setor, objetivo, audiência, estilo, cores, páginas, funcionalidades, idiomas, conteúdo, domínio, prazo, orçamento **declarado pelo cliente**.
- acknowledgement: identificação da versão de política de privacidade, hora validada **pelo servidor** e informação apropriada.
- metadata: idioma da interface e origem da página; sem trackers intrusivos.
- server_fields: ID interno, estado, data de receção, estado do e-mail, responsável interno, histórico de alterações.

**Nota:** esta especificação não substitui uma auditoria jurídica ou de segurança.

## Fontes do código
- Formulário e UI: brief-builder/index.html e brief-builder/proposal-preview.css.
- Lógica local: brief-builder/proposal-preview.js.
- Verificação automatizada: tests/proposal-preview-smoke.cjs, integrada no workflow KRM Languages Browser QA.
- Histórico de decisões: docs/KRM_CLIENT_JOURNEY_ROADMAP_PT.md.
