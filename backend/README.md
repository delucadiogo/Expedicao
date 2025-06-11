# Backend do Sistema de Expedição

Este é o backend do sistema de expedição, desenvolvido com Node.js, TypeScript, Express e PostgreSQL.

## Requisitos

- Node.js 18 ou superior
- PostgreSQL 17
- Git

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=expedicao
DB_PASSWORD=postgres
DB_PORT=5432
```

4. Crie o banco de dados:
```bash
createdb expedicao
```

5. Execute as migrações:
```bash
psql -d expedicao -f src/database/migrations/001_initial_schema.sql
```

## Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

## Build

Para criar a build de produção:
```bash
npm run build
```

## Produção

Para iniciar o servidor em produção:
```bash
npm start
```

## Testes

Para executar os testes:
```bash
npm test
```

## Estrutura do Projeto

```
src/
  ├── config/         # Configurações do projeto
  ├── controllers/    # Controladores da aplicação
  ├── database/       # Configurações e migrações do banco de dados
  ├── routes/         # Rotas da API
  ├── services/       # Lógica de negócio
  ├── types/          # Definições de tipos TypeScript
  └── app.ts          # Arquivo principal da aplicação
```

## API Endpoints

### Expedições

- `GET /api/expeditions` - Lista todas as expedições
- `GET /api/expeditions/stats` - Obtém estatísticas das expedições
- `GET /api/expeditions/:id` - Obtém uma expedição específica
- `POST /api/expeditions` - Cria uma nova expedição
- `PUT /api/expeditions/:id` - Atualiza uma expedição
- `DELETE /api/expeditions/:id` - Remove uma expedição

### Controle de Qualidade

- `PUT /api/expeditions/:id/quality-control` - Atualiza o controle de qualidade de uma expedição

### Rejeição

- `PUT /api/expeditions/:id/rejection` - Atualiza a rejeição de uma expedição

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request 