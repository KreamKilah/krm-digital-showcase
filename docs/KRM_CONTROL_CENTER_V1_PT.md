# KRM DIGITAL — Control Center V1 (demonstração funcional)

Data: 11/11/2026
Estado: DEMO PÚBLICA. Não é software de gestão privado, não está ligada a clientes nem a sistemas de faturação.

## Objetivo
Validar o processo operacional da agência KRM DIGITAL, da ideia do cliente até à entrega, antes de registar atividade ou abrir um serviço comercial.

## Onde se encontra
- URL de demonstração: https://kreamkilah.github.io/krm-digital-showcase/control-center-demo/
- Código: control-center-demo/index.html, style.css e app.js
- Testes: tests/control-center-smoke.cjs
- Workflow: .github/workflows/krm-control-center-qa.yml

**Aviso:** o nome "Control Center" não significa que o site seja privado. A versão no GitHub Pages é pública. Usar APENAS projetos e contactos fictícios.

## Módulos implementados
1. **Dashboard** — pedidos em aberto, trabalhos em produção, propostas, tarefas pendentes, atividades e projetos em destaque.
2. **Pedidos (pipeline)** — colunas Novo, Em análise, Proposta, Aprovado, Em produção, Entregue. Pesquisa, filtro e ficha individual.
3. **Projetos** — descrição, fase, progresso ilustrativo, briefing resumido e notas fictícias.
4. **Propostas** — criar rascunho de exemplo, editar linhas e valores, gerar pré-visualização, copiar ou exportar TXT. Não é orçamento vinculativo, fatura, pagamento ou confirmação.
5. **Tarefas** — atribuição a projeto, lista filtrada, marcar conclusão, adicionar e remover tarefas fictícias.
6. **Histórico** — últimas ações apenas na memória da página.
7. **Importação de Brief Studio** — carrega localmente um TXT exportado do Brief Studio e transforma-o numa ficha fictícia do pipeline.

## Como testar o percurso completo
1. Ir ao Brief Studio em https://kreamkilah.github.io/krm-digital-showcase/brief-builder/.
2. Preencher com dados inventados, por exemplo "Café Horizonte", e exportar o briefing em TXT.
3. Abrir o Control Center DEMO e entrar em "Pedidos".
4. Clicar em "Importar Brief .TXT" e escolher o ficheiro fictício.
5. Abrir o pedido, alterar estado para "Em análise" e guardar uma nota de exemplo.
6. Em "Propostas", escolher a mesma ficha, criar rascunho, editar os valores simulados e exportar.
7. Em "Tarefas", criar uma tarefa fictícia, concluir e reabrir.
8. Na ficha do projeto, abrir a "Client Space (demo)" para conhecer a futura experiência do cliente (não existe sincronização).
9. Reiniciar os dados da demonstração.

## Restrições importantes
- **Não existe autenticação ou separação por cliente**. Não usar com dados de pessoas reais.
- **Não existe backend nem armazenamento**: cada refresh do Control Center reinicia a demonstração, incluindo ficheiros importados.
- A importação TXT é local no navegador, com limite de 32 KB e validação de formato KRM. O ficheiro não é enviado.
- O orçamento é um exemplo comercial **sem validade**, não inclui cálculo de IVA ou faturação.
- Não existe integração efetiva entre Control Center e Client Space, nem envio de emails ou submissão de pedidos.
- Todos os rótulos e dados são expressamente fictícios e a página avisa sobre este limite.
- O painel interno está inicialmente em PT-PT; a experiência voltada ao cliente no Brief Studio mantém os idiomas DE/PT/EN.

## Antes de poder trabalhar com clientes reais
1. Confirmar início de atividade, registo aplicável na Alemanha, política de privacidade, Impressum e contrato.
2. Criar um **Control Center verdadeiramente privado**, alojado com autenticação e autorização por perfis e com base de dados protegida.
3. Fazer a entrada real dos pedidos através de API segura e validações no servidor, evitando dados no repositório público.
4. Guardar os pedidos, ficheiros e histórico com permissões por cliente e por projeto; backups, logs e eliminação conforme RGPD.
5. Integrar emails de confirmação após receção real e aprovações verificáveis por clientes autenticados.
6. Integrar propostas e pagamentos só depois de avaliação jurídica/fiscal. Usar software adequado para faturas legais.
7. Testar acesso sem autorização, fuga de dados, uploads, abuso, operações duplicadas e recuperações.

## Critérios para validar a demo
- [x] Site público acessível e visível em telemóvel e PC
- [x] Navegação e filtros
- [x] Criar pedido fictício, alterar estado e consultar projeto
- [x] Criar, editar, copiar e descarregar proposta fictícia
- [x] Adicionar, concluir e remover tarefas
- [x] Importar ficheiro TXT fictício do Brief Studio sem rede
- [x] Teste de ausência de requests de escrita (POST, etc.) e de persistência
- [x] Confirmar que não há conteúdos HTML executados a partir de entradas fictícias
- [x] Capturas em quatro larguras e revisão visual

O GitHub Actions verifica automaticamente estas operações, mas a validação presencial em equipamentos reais e o feedback de pessoas são etapas separadas.

Verificações automáticas em Chromium concluídas com sucesso em 360, 390, 768 e 1440 px (incluindo handoff local de TXT), workflow: https://github.com/KreamKilah/krm-digital-showcase/actions/runs/43117784497.

GitHub Pages da demo confirmado acessível em https://kreamkilah.github.io/krm-digital-showcase/control-center-demo/.

**Limitação:** este teste não substitui observação num telemóvel físico e validação com pessoas reais usando apenas dados inventados. A acessibilidade e segurança de uma futura versão privada exigem auditoria própria.

## Próximo trabalho recomendado
Criar critérios de aceitação com um "cliente" fictício e simular um projeto de ponta a ponta. Depois, decidir a arquitetura privada e jurídica necessária para uma futura operação comercial.
