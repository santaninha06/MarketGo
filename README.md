# 🛒 MarketGo

**MarketGo** é um aplicativo mobile de compras que conecta usuários a lojas e produtos, permitindo navegar pelo catálogo, adicionar itens ao carrinho, finalizar pedidos e acompanhar o histórico de compras.

O projeto foi desenvolvido com foco em uma experiência de compra simples, organização do código, validação de dados e segurança no acesso às informações.

## ✨ Funcionalidades

- 🏪 Listagem de lojas e produtos.
- 🔎 Navegação por lojas e catálogo.
- 🛍️ Carrinho de compras.
- 💳 Checkout com validação de dados e pagamento.
- 🔐 Cadastro, login e gerenciamento de sessão.
- 📦 Criação e consulta de pedidos.
- 📋 Histórico de pedidos e visualização de detalhes.
- 🔄 Acompanhamento do status dos pedidos.
- 🔒 Controle de acesso e privacidade dos dados.

## 🧰 Tecnologias utilizadas

- **React Native** — desenvolvimento mobile.
- **Expo** — ambiente de desenvolvimento e execução.
- **TypeScript** — tipagem estática.
- **Expo Router** — navegação entre telas.
- **Supabase** — autenticação, banco de dados e controle de acesso.
- **PostgreSQL** — persistência e regras de dados.
- **TanStack Query** — gerenciamento de consultas.
- **Zod** — validação de dados.
- **Jest** — testes automatizados.
- **PGlite** — execução local dos testes de banco de dados.
- **Prettier** — padronização do código.

## 📱 Telas e recursos

O aplicativo contempla os seguintes fluxos:

1. Autenticação: cadastro e login.
2. Catálogo: navegação pelas lojas e produtos.
3. Carrinho: inclusão e gerenciamento dos itens.
4. Checkout: validação das informações e envio do pedido.
5. Pedidos: histórico, detalhes e acompanhamento de status.

## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js e npm instalados.
- Git instalado.
- Projeto Supabase configurado.
- Expo Go ou um emulador compatível.

### 1. Clonar o repositório

```bash
git clone https://github.com/santaninha06/MarketGo.git
cd MarketGo
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, usando `.env.example` como referência.

Preencha as variáveis com os dados do seu próprio projeto Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=SUA-CHAVE-PUBLICA
```



### 4. Configurar o banco de dados

No projeto Supabase, execute os scripts SQL disponibilizados na pasta `supabase/`, respeitando a ordem necessária para criar a estrutura e inserir os dados iniciais:

- `supabase/schema.sql`
- `supabase/seed.sql`

Confira também as políticas de acesso e as configurações de autenticação antes de utilizar o aplicativo.

### 5. Iniciar o aplicativo

```bash
npx expo start
```

Siga as instruções exibidas no terminal para abrir o aplicativo no ambiente desejado.

## 🧪 Testes e qualidade

O projeto possui testes automatizados para funcionalidades do aplicativo e regras do banco de dados.

Executar todos os testes:

```bash
npm test
```

Executar apenas os testes do aplicativo:

```bash
npm run test:app
```

Executar apenas os testes do banco de dados:

```bash
npm run test:db
```

Verificar os tipos TypeScript:

```bash
npm run typecheck
```

Formatar os arquivos do aplicativo:

```bash
npm run format
```

### Status da validação

Na validação realizada durante o desenvolvimento:

- **23 testes do aplicativo aprovados.**
- **13 testes do banco de dados aprovados.**
- Verificação de tipos TypeScript concluída sem erros.

Esses resultados correspondem à versão testada durante o desenvolvimento; não representam uma garantia de execução em todos os ambientes.

## 🔐 Segurança

O projeto utiliza autenticação e regras de acesso no banco de dados para proteger as informações dos usuários e seus pedidos.

Boas práticas adotadas:

- Arquivos de ambiente locais excluídos do Git.
- Validação de dados de entrada.
- Verificação de permissões para operações com pedidos.
- Regras de privacidade para impedir acesso indevido a pedidos de outros usuários.
- Validação das operações de criação e alteração de status dos pedidos.

## 📂 Estrutura do projeto

```text
MarketGo/
├── app/                 # Telas e rotas do aplicativo
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── constants/       # Constantes
│   ├── context/         # Contextos da aplicação
│   ├── hooks/           # Hooks personalizados
│   ├── lib/             # Configurações e bibliotecas
│   ├── schemas/         # Validação de dados
│   ├── services/        # Serviços e acesso aos dados
│   ├── theme/           # Tema visual
│   ├── types/           # Tipos TypeScript
│   └── utils/           # Funções auxiliares
├── __tests__/           # Testes do aplicativo
├── supabase/
│   ├── schema.sql       # Estrutura do banco
│   ├── seed.sql         # Dados iniciais
│   └── tests/           # Testes do banco
├── scripts/             # Scripts auxiliares
├── .env.example         # Modelo de variáveis de ambiente
└── package.json
```

## 🎯 Objetivo do projeto

O MarketGo foi desenvolvido como um projeto de aplicação mobile, integrando interface, autenticação, persistência de dados, regras de negócio e testes automatizados.

A proposta é aplicar conceitos de desenvolvimento de software na construção de uma solução funcional, organizada e preparada para evoluções futuras.

## 👨‍💻 Desenvolvido por

**Gabriel Santana Oliveira Silva**

Projeto acadêmico desenvolvido com foco em desenvolvimento mobile e integração com backend.

---

🔗 **Repositório:** https://github.com/santaninha06/MarketGo
