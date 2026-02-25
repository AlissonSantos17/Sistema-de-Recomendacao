import { existsSync, readFileSync } from 'node:fs';
import { resolveBackendPath, writeJson } from './utils';

type UserRatings = Record<string, number>;
type UsersIndex = Record<string, UserRatings>;

type GraphEdge = { to: string; weight: number };
type UserGraph = Record<string, GraphEdge[]>;

function commonMovieIds(a: UserRatings, b: UserRatings): string[] {
  const aKeys = Object.keys(a);
  const result: string[] = [];

  for (const movieId of aKeys) {
    if (Object.prototype.hasOwnProperty.call(b, movieId)) {
      result.push(movieId);
    }
  }

  return result;
}

function euclideanDistanceByCommonMovies(
  userA: UserRatings,
  userB: UserRatings,
  commonIds: string[]
): number {
  let sum = 0;
  for (const movieId of commonIds) {
    sum += (userA[movieId] - userB[movieId]) ** 2;
  }
  return Math.sqrt(sum);
}

function main(): void {
  const usersPath = process.env.USERS_JSON ?? resolveBackendPath('data/generated/users.json');
  const outputPath = process.env.GRAPH_JSON ?? resolveBackendPath('data/generated/userGraph.json');

  if (!existsSync(usersPath)) {
    throw new Error(`Arquivo users.json nao encontrado: ${usersPath}`);
  }

  const users = JSON.parse(readFileSync(usersPath, 'utf8')) as UsersIndex;
  const userIds = Object.keys(users);

  const candidateEdges: UserGraph = {};

  for (const userId of userIds) {
    candidateEdges[userId] = [];
  }

  for (let i = 0; i < userIds.length; i += 1) {
    for (let j = i + 1; j < userIds.length; j += 1) {
      const u1 = userIds[i];
      const u2 = userIds[j];

      const commonIds = commonMovieIds(users[u1], users[u2]);
      if (commonIds.length <= 10) {
        continue;
      }

      const weight = euclideanDistanceByCommonMovies(users[u1], users[u2], commonIds);
      candidateEdges[u1].push({ to: u2, weight });
      candidateEdges[u2].push({ to: u1, weight });
    }
  }

  const graph: UserGraph = {};
  for (const userId of userIds) {
    const edges = candidateEdges[userId];
    if (!edges.length) {
      graph[userId] = [];
      continue;
    }

    const meanWeight = edges.reduce((acc, edge) => acc + edge.weight, 0) / edges.length;
    graph[userId] = edges.filter((edge) => edge.weight < meanWeight);
  }

  writeJson(outputPath, graph);
  console.log(`userGraph.json gerado com ${userIds.length} vertices em: ${outputPath}`);
}

main();
