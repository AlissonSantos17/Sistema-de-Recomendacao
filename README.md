# Sistema-de-Recomendacao

Sistema de recomendacao de filmes com backend em NestJS e abordagem em grafo de usuarios.

## Backend (NestJS)

O backend foi migrado para NestJS e organizado em camadas:

- `backend/src/modules/recommendation`: endpoints e regras de recomendacao
- `backend/src/modules/health`: endpoint de saude
- `backend/scripts`: pipeline offline para gerar `users.json`, `movies.json` e `userGraph.json`
- `backend/data/generated`: artefatos JSON usados pela API

### Algoritmo de recomendacao

A recomendacao usa grafo de usuarios + Dijkstra modificado:

1. Cria arestas apenas entre usuarios com mais de 10 filmes em comum.
2. Peso da aresta = distancia euclidiana entre notas dos filmes compartilhados.
3. Mantem arestas com peso menor que a media de pesos de cada vertice.
4. Dijkstra percorre os usuarios mais proximos e para quando junta 16 filmes candidatos.
5. Remove filmes ja avaliados pelo usuario alvo.

## Como rodar o backend

### 1) Instalar dependencias

```bash
cd backend
npm install
```

### 2) Gerar dados offline

```bash
npm run data:build
```

Isso gera:

- `backend/data/generated/users.json`
- `backend/data/generated/movies.json`
- `backend/data/generated/userGraph.json`

Observacao: se `ratings.csv` nao existir, o script de usuarios usa `backend/users.json` legado como fallback.

### 3) Subir API

```bash
npm run start:dev
```

API padrao: `http://localhost:5000`
Swagger UI: `http://localhost:5000/docs`

### 4) Configurar TMDb (opcional, para posters)

Crie `backend/.env` com base em `backend/.env.example`:

```env
TMDB_API_BASE_URL=https://api.themoviedb.org
TMDB_BEARER_TOKEN=seu_token_bearer_tmdb
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

Sem `TMDB_BEARER_TOKEN`, o endpoint de posters continua funcionando, mas retorna lista vazia.

## Contrato da API

- `GET /health`
- `GET /users/:id/exists`
- `GET /users/:id/top-rated?limit=16`
- `GET /users/:id/recommendations?limit=16`
- `GET /movies/:movieId/posters?language=pt-BR`

### Exemplos de resposta

`GET /users/1/exists`

```json
{
  "userId": "1",
  "exists": true
}
```

`GET /users/1/top-rated?limit=2`

```json
{
  "userId": "1",
  "limit": 2,
  "total": 2,
  "items": [
    {
      "movieId": "296",
      "title": "Pulp Fiction (1994)",
      "genres": "Comedy|Crime|Drama|Thriller",
      "imdbId": "0110912",
      "tmdbId": "680",
      "rating": 5
    }
  ]
}
```

`GET /users/1/recommendations?limit=2`

```json
{
  "userId": "1",
  "limit": 2,
  "total": 2,
  "items": [
    {
      "movieId": "2571",
      "title": "Matrix, The (1999)",
      "genres": "Action|Sci-Fi|Thriller",
      "imdbId": "0133093",
      "tmdbId": "603",
      "score": 3.429,
      "sourceUserId": "12"
    }
  ]
}
```

`GET /movies/603/posters?language=pt-BR`

```json
{
  "movieId": 603,
  "total": 1,
  "items": [
    {
      "filePath": "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      "previewUrl": "https://image.tmdb.org/t/p/w342/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      "originalUrl": "https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      "width": 2000,
      "height": 3000,
      "iso639_1": "en",
      "voteAverage": 5.5,
      "voteCount": 12
    }
  ]
}
```

## Testes

```bash
cd backend
npm test
```

## Docker

Na raiz do projeto:

```bash
docker compose up --build
```

O backend sobe na porta `5000`.
