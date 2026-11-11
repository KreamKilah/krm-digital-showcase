# KRM DIGITAL — Brief Builder v2 / especificação de entrega

Data: 11/11/2026
Âmbito: Fase 2 do roadmap, sem submissão de dados, pagamentos ou geração automática de orçamento.

## Localização
- Interface pública: [brief-builder/](../brief-builder/index.html).
- Código: [app.js](../brief-builder/app.js) e [style.css](../brief-builder/style.css).
- Entrada no portefólio: botão **Briefing completo** no gerador de ideias da página principal.
- O botão transfere apenas os identificadores conhecidos de setor, estilo e objetivo por parâmetros de URL (valores escolhidos entre opções predefinidas; sem dados pessoais).
- O mini-gerador existente mantém-se funcional como experiência inicial.

## Percurso do visitante
1. **Marca e objetivo (obrigatórios)**: setor e objetivo principal. Nome da marca e público-alvo são opcionais.
2. **Identidade visual**: estilo, cores, referência pública e notas de design.
3. **Arquitetura do site**: páginas, funcionalidades e requisitos especiais. As opções são uma lista de desejos, não promessa de entrega.
4. **Execução**: disponibilidade de textos/imagens, logótipo, domínio/alojamento, línguas, prazo e orçamento indicativo. Notas adicionais opcionais.
5. **Revisão**: resumo em linguagem natural com todos os campos, cópia para área de transferência e exportação local em TXT.

O utilizador pode voltar atrás, editar escolhas, saltar entre etapas depois de satisfazer os dois campos obrigatórios e reiniciar após confirmação. O progresso visível representa a etapa em que se encontra, **não uma percentagem de trabalho executado**.

## Línguas e acessibilidade
- Interface em DE, PT-PT e EN, com tradução das opções, mensagens, validação, resumo e exportação.
- Preferência do idioma guardada na chave local krm-site-language (partilhada com o portefólio).
- Navegação por teclado, botões reais, labels, controlo de seleção via aria-pressed, alerta de validação e barra de progresso acessível.
- Responsive para telemóvel, tablet e desktop. Respeita prefers-reduced-motion.

## Regras de privacidade
- **Sem endpoint de submissão, API comercial, autenticação, base de dados ou e-mails enviados.**
- Os campos do briefing permanecem apenas na memória temporária do separador; desaparecem com o refresh/fecho.
- O único dado persistido automaticamente é a **preferência de idioma**, não o conteúdo do projeto.
- Copiar ou descarregar o TXT é uma ação direta do visitante. Não existe upload nem partilha automática com a KRM.
- Não pedir nomes completos de pessoas, moradas, números fiscais ou credenciais. As notas opcionais não se destinam a dados sensíveis.
- Os links de referência são validados com protocolos HTTP(S); não são visitados pelo código do gerador.
- Qualquer futura recolha de contacto deve ser criada **noutra fase**, depois de informação de privacidade, base legal, validação e antispam.

## Regra comercial
- A escolha de orçamento é uma orientação dada pelo visitante, **não um preço recomendado, calculado ou aceite**.
- A seleção de funcionalidades não representa proposta comercial, contrato ou prazo garantido.
- O texto exportado identifica-se sempre como conceito não vinculativo.
- O procedimento seguinte terá análise humana e posterior proposta/contrato, sem automatizar aprovação nem pagamentos.

## QA
- Teste automatizado: [tests/brief-builder-smoke.cjs](../tests/brief-builder-smoke.cjs).
- GitHub Actions: workflow KRM Languages Browser QA, validando DE/PT/EN, adaptação 360/390/768/1440 px, seleção de opções, validação de URL, exportação TXT, cópia, ausência de persistência dos dados de projeto e passagem do mini-gerador para o briefing.
- Testes visuais adicionais no telemóvel real devem ser feitos antes de campanhas ou envio a possíveis clientes.
