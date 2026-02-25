# Frontend - Sistema de Recomendacao de Filmes

Frontend em `React + TypeScript + Vite` consumindo a API NestJS.

## Executar localmente

1. Crie um arquivo `.env` a partir de `.env.example`.
2. Instale dependencias:

```bash
npm install
```

3. Rode a aplicacao:

```bash
npm start
```

A interface sobe em `http://localhost:3000`.

## Variaveis de ambiente

- `REACT_APP_API_URL`: URL base da API (default no codigo: `http://localhost:5000`).

## Scripts

- `npm start`: inicia Vite em `0.0.0.0:3000`.
- `npm run build`: compila TypeScript e gera build de producao.
- `npm run preview`: publica build localmente.
- `npm run test`: executa testes unitarios/integracao com Vitest.
- `npm run lint`: executa ESLint.

## Fluxos implementados

- Login por ID de usuario via `GET /users/:id/exists`.
- Dashboard protegido por autenticacao em contexto + `localStorage`.
- Bloco de top rated via `GET /users/:id/top-rated`.
- Bloco de recomendacoes via `GET /users/:id/recommendations`.
- Estados por secao: loading, erro e vazio.
