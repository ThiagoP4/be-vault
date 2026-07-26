# 🛡️ Be-Vault

Be-Vault é um gerenciador de senhas e credenciais altamente seguro, construído com uma arquitetura **Zero-Knowledge** (Conhecimento Zero). Ele foi projetado para atuar como um cofre centralizado e, no futuro, como um Provedor de Identidade (SSO) para destrancar outros projetos do ecossistema.

## 🎯 Objetivo

O objetivo principal do Be-Vault não é apenas armazenar senhas, mas garantir que **ninguém** (nem mesmo o administrador do banco de dados, provedor de hospedagem ou criador do sistema) consiga ler as informações salvas. Os dados são criptografados matematicamente no navegador do usuário antes de serem enviados para a nuvem.

## 🏗️ Arquitetura e Tecnologias

*   **Frontend:** Vue.js 3, Vite, TypeScript, Pinia (Gerenciamento de Estado).
*   **Backend & Autenticação:** Supabase (PostgreSQL + Auth).
*   **Criptografia (End-to-End):** WebCrypto API nativa do navegador.
    *   **Derivação de Chave:** PBKDF2 com 600.000 iterações (SHA-256) usando a Senha Mestra do usuário.
    *   **Criptografia de Dados:** AES-256-GCM para criptografia simétrica dos itens do cofre.
*   **Infraestrutura:** Oracle Cloud Infrastructure (OCI), Docker, Nginx, Tailscale.

## 🔒 Segurança em Primeiro Lugar

O Be-Vault foi auditado e desenhado com múltiplas camadas de segurança:

1.  **Zero-Knowledge:** O servidor armazena apenas textos cifrados indecifráveis (`encrypted_data`). A chave mestra nunca sai do dispositivo do usuário.
2.  **Row Level Security (RLS):** Configurado no PostgreSQL do Supabase. Um usuário é fisicamente impedido pelo banco de dados de acessar linhas que pertençam a outro usuário (`USING (auth.uid() = user_id)`).
3.  **Proteção contra XSS:** Política de Segurança de Conteúdo (CSP) rigorosa injetada no `index.html`, bloqueando a execução de scripts maliciosos de terceiros e restringindo conexões.
4.  **Isolamento de Memória:** As chaves criptográficas da sessão são mantidas estritamente na memória volátil (RAM) através do Pinia e descartadas imediatamente ao recarregar a página ou fazer logout.

## 🚀 Infraestrutura e Deploy (Oracle + Docker)

O projeto é hospedado de forma soberana na Oracle Cloud, orquestrado via Docker e exposto de forma segura utilizando túneis da Tailnet, sem a necessidade de abrir portas no firewall da nuvem ou comprar domínios.

### Estrutura do Docker

O deploy utiliza um `docker-compose.yml` que sobe dois containers interligados:

1.  **O Sidecar da Rede (`ts-bevault`):** Um container responsável exclusivamente por conectar a aplicação a uma rede privada virtual e criar uma URL pública via Funnel com HTTPS automático.
2.  **A Aplicação (`be-vault-app`):** Um container construído a partir de um `Dockerfile` multi-stage:
    *   **Build Stage:** Usa Node.js para baixar dependências e compilar o Vue.js (`npm run build`).
    *   **Production Stage:** Usa um servidor Nginx ultraleve (Alpine) para servir os arquivos estáticos (`/dist`), configurado com um `nginx.conf` otimizado para Vue Router (SPA).
    *   *Nota de Segurança:* Este container não expõe portas para a máquina host; ele trafega exclusivamente de forma invisível através do container sidecar (`network_mode: service:tailscale`).

### Como subir o projeto no Servidor

1.  **Configuração de Variáveis:**
    Crie um arquivo secreto `.env` na raiz do projeto no servidor. *(Nota: Este arquivo não deve ser commitado no repositório)*.
    ```env
    TS_AUTHKEY=tskey-auth-... (Chave Epêmera e Reutilizável de Rede)
    VITE_SUPABASE_URL=https://...
    VITE_SUPABASE_ANON_KEY=...
    ```

2.  **Build e Deploy:**
    ```bash
    # Constrói a imagem do cofre lendo as variáveis do ambiente
    docker build -t be-vault:latest .
    
    # Sobe a arquitetura orquestrada (Sidecar + Cofre)
    docker compose up -d
    ```

3.  **Expondo para a Internet:**
    Para gerar o certificado SSL (HTTPS) e a URL pública da aplicação, execute o comando de túnel dentro do container de rede:
    ```bash
    docker exec ts-bevault tailscale funnel --bg 80
    ```

## 🔮 Próximos Passos (Roadmap)

*   **Be-Vault SSO (Single Sign-On):** Transformar o cofre em um Identity Provider (IdP) para injetar credenciais e liberar acessos em outros projetos do ecossistema de forma centralizada (ex: N8N, automações).
