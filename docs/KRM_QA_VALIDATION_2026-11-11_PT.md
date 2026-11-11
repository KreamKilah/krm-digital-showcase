# KRM DIGITAL — Relatório de QA / Validação de protótipo

Data: 11.11.2026
Resultado: **PASSOU os testes automáticos de código e interação.**
Âmbito: portefólio, Brief Builder e simulação de pedido de proposta. Não substitui testes legais, de segurança de um backend real ou testes em dispositivos físicos.

## 1. Publicação no GitHub Pages

- URL base: https://kreamkilah.github.io/krm-digital-showcase/
- Brief Studio: https://kreamkilah.github.io/krm-digital-showcase/brief-builder/
- Client Space fictícia: https://kreamkilah.github.io/krm-digital-showcase/client-space-demo/
- Após vários runs com startup_failure e alguns jobs em fila, uma execução do GitHub Pages concluiu com sucesso. A versão com o ajuste mobile foi publicada com sucesso no commit 316a273a.
- As páginas principais e os projetos NOVA, VANTA, ORLA, bem como a Client Space demo, responderam através de uma consulta externa. A consulta não testa toda a interação JavaScript no browser do visitante.

## 2. Verificações automáticas

Execução final com sucesso: https://github.com/KreamKilah/krm-digital-showcase/actions/runs/43101270017

- 9/9 verificações estáticas: sintaxe JavaScript, tradução dos campos, correspondência entre IDs e scripts, acesso a recursos, estrutura dos formulários, ausência de endpoint de submissão, exportação local e caráter demonstrativo da Client Space.
- Testes de Playwright/Chromium aprovados em 360, 390, 768 e 1440 px.
- Alternância DE → PT-PT → EN; conteúdo e gerador reagem ao idioma.
- Gerador rápido → Brief Builder, preservando setor, estilo e objetivo.
- Brief Builder de cinco etapas: campos obrigatórios, navegação, URL inválida, escolhas, resumo, cópia e descarregamento TXT.
- Simulação do pedido: nome e e-mail obrigatórios, aviso de demonstração obrigatório, revisão de dados, exemplo de e-mail e documento de rascunho.
- O teste confirmou **nenhum pedido HTTP POST** na simulação, ausência de armazenamento local dos dados de contacto e proteção de conteúdo inserido pelo visitante contra injeção HTML no resumo.
- Nenhum scroll horizontal reportado nas larguras testadas.

## 3. Inspeção visual

- Capturadas dez imagens PNG em Chromium headless: portefólio PT, primeira etapa, resumo final, pedido e exemplo do resultado, em tamanhos de telemóvel e computador.
- A inspeção identificou um problema de prioridade da informação no telemóvel: o cartão de pré-visualização do projeto surgia antes do formulário e ocupava o primeiro ecrã.
- **Correção aplicada:** em viewports até 860 px, o briefing aparece primeiro e a caixa auxiliar passa para depois do formulário. A primeira etapa no ecrã de 390 px apresenta agora logo o título, o progresso e os campos iniciais.
- Teste de regressão adicionado para impedir que o resumo volte a aparecer antes do formulário em mobile.
- As capturas de telemóvel após correção não evidenciaram sobreposição de botões ou texto cortado nas secções inspecionadas.
- Imagens disponíveis em GitHub Actions, artefacto krm-visual-qa do run acima (retenção limitada).

## 4. Limites e riscos ANTES de oferecer serviços comerciais

- O site, o Brief Builder e a Client Space são **demonstrações públicas**. Não recebem pedidos reais, não emitem faturas, não processam pagamentos nem criam contas privadas.
- A opção "pedido de proposta" apenas **simula** preenchimento, confirmação e rascunho; os dados não são transmitidos para a KRM.
- **Ainda pendente:** regularização da atividade e dos requisitos legais aplicáveis na Alemanha antes de iniciar a prestação comercial; impressum/política de privacidade/termos e condições adequados.
- **Ainda pendente:** servidor seguro, validação de submissão, anti-spam, proteção de dados pessoais, notificações reais, registo de pedidos, gestão interna e acesso individual por cliente.
- **Ainda pendente:** testes manuais em navegador móvel real e eventual revisão visual adicional em Safari/Firefox, não incluídos no ensaio de Chromium.
- Integrações externas, imagens e fontes devem ser revistas antes do lançamento público comercial, para conformidade e continuidade.

## 5. Próximos passos

1. Manter o protótipo público, recolher **feedback não comercial**, sem aceitar encomendas nem recolher dados privados no repositório.
2. Corrigir qualquer crítica visual/funcional observada por participantes no teste.
3. Escolher estratégia de alojamento/backend, definir dados legais e política de privacidade para futura abertura do canal de propostas.
4. Só depois implementar pedidos reais, notificações e Client Space com login e regras de acesso.
5. Repetir o QA de browsers e efetuar revisão jurídica e de segurança antes de iniciar atividade comercial.

Referências de teste: tests/site-integrity.cjs; tests/i18n-smoke.cjs; tests/brief-builder-smoke.cjs; tests/proposal-preview-smoke.cjs; tests/visual-capture.cjs.
