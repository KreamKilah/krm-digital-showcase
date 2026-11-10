# KRM DIGITAL — Client Space Privada (fase 1)
**Data:** 10-11-2026
**Estado:** Base de autenticação e aplicação criada, testada com dados fictícios; ambiente Railway preparado em STAGING, SEM deployment ativo.

## Onde está cada coisa
- Demonstração pública antiga: https://kreamkilah.github.io/krm-digital-showcase/client-space-demo/
- Aplicação privada real (código): pasta client-portal/ no repositório KreamKilah/krm-digital-showcase
- Railway: projeto privado KRM Client Space, ID 8943bf2b-8124-4b83-b67b-ef56e16b84c3; ambiente staging ID b6d33d41-b9cf-41f0-ade8-8ceeea485dc7
- Serviço staged (não publicado): krm-private-portal-api, ligado à branch main, rootDirectory /client-portal, NODE_ENV production, LAUNCH_ENABLED false.
- CI: .github/workflows/krm-private-portal-ci.yml.

## Já implementado
- Autenticação por email/password com hash scrypt e sessões em PostgreSQL; cookie Secure/HttpOnly/SameSite Strict.
- Perfis admin e cliente; permissões por projeto verificadas SEMPRE no backend.
- Projetos, milestones, comentários, versões de aprovação e decisões registadas.
- Convites privados de 48h gerados apenas pelo administrador.
- Restrição de Origem e CSRF token nas alterações; login com limites no servidor por IP e email.
- Interface cliente/admin ligada à API, sem scripts externos, sem segredos ou dados reais.
- Base de dados SQL e comandos de migração/criação inicial do admin.
- Scripts de teste de API e navegador com base de dados temporária.
- Nenhum upload privado, pagamento, fatura real ou inscrição pública ativa.

## Porque não está aberto ao público
A demonstração estática GitHub Pages nunca pode servir como área privada. A aplicação REAL precisa de PostgreSQL, um serviço separado e um domínio HTTPS. Em produção, LAUNCH_ENABLED=false por defeito. No Railway foi preparado apenas um ambiente staged; **não houve deploy e não há base de dados nem serviços a consumir recursos**.

## Portas obrigatórias antes de entrar com contas reais
1. Ligar PostgreSQL privado dedicado, backups e retenção.
2. Confirmar hostname HTTPS e APP_ORIGIN exata; só depois dar deploy.
3. Definir a conta de administrador por canal seguro; não enviar palavras-passe neste chat. Remover variáveis de bootstrap assim que o admin existir.
4. Validar recuperações de conta, posse do email nos convites e MFA para administração.
5. Fazer testes externos de segurança, acessibilidade e carga; rever logs, monitorização e abuso.
6. Preparar Impressum, Datenschutz, finalidade/consentimento e política de eliminação; configurar região de armazenamento.
7. Só com tudo verificado ativar LAUNCH_ENABLED=true e disponibilizar acessos aos clientes.

## Próximas funcionalidades
- Notificações por email do cliente.
- Uploads privados de design/documentos (storage + scanning + quotas + URLs assinadas).
- Faturas e pedidos de alterações com controlo de revisão.
- Dashboard admin com vários clientes e histórico operacional.

**Decisão atual:** preservar a demo pública, não criar contas com pessoas reais e não fazer despesas automáticas. O objetivo é avançar com segurança para um produto que a KRM DIGITAL pode realmente usar.
