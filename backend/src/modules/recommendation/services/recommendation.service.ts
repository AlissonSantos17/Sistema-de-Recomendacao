import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { DataRepository } from '../repositories/data.repository';
import {
  RecommendedMovie,
  TopRatedMovie,
  UserGraph,
  UsersIndex
} from '../types/recommendation.types';

interface QueueNode {
  userId: string;
  distance: number;
}

@Injectable()
export class RecommendationService {
  constructor(private readonly dataRepository: DataRepository) {}

  userExists(userId: string): boolean {
    const users = this.dataRepository.getUsers();
    return Object.prototype.hasOwnProperty.call(users, userId);
  }

  getTopRatedMovies(userId: string, limit: number): TopRatedMovie[] {
    const users = this.dataRepository.getUsers();
    const movies = this.dataRepository.getMovies();
    const ratings = this.getUserRatingsOrThrow(users, userId);

    return Object.entries(ratings)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([movieId, rating]) => ({
        movieId,
        rating,
        ...this.getMovieOrFallback(movies, movieId)
      }));
  }

  getRecommendations(userId: string, limit: number): RecommendedMovie[] {
    const users = this.dataRepository.getUsers();
    const movies = this.dataRepository.getMovies();
    const graph = this.dataRepository.getGraph();

    const targetRatings = this.getUserRatingsOrThrow(users, userId);
    const watchedMovies = new Set(Object.keys(targetRatings));

    if (!Object.prototype.hasOwnProperty.call(graph, userId)) {
      return [];
    }

    const distances = this.runModifiedDijkstra(graph, userId, limit);
    const sortedUsers = Object.entries(distances)
      .filter(([candidateUserId]) => candidateUserId !== userId)
      .sort((a, b) => a[1] - b[1]);

    const scoredMovies = new Map<string, { score: number; sourceUserId: string }>();

    for (const [candidateUserId, distance] of sortedUsers) {
      const candidateRatings = users[candidateUserId];
      if (!candidateRatings) {
        continue;
      }

      for (const [movieId, rating] of Object.entries(candidateRatings)) {
        if (watchedMovies.has(movieId)) {
          continue;
        }

        const similarityScore = rating / (1 + distance);
        const previous = scoredMovies.get(movieId);

        if (!previous || similarityScore > previous.score) {
          scoredMovies.set(movieId, {
            score: similarityScore,
            sourceUserId: candidateUserId
          });
        }
      }

      // Dijkstra modificado: interrompe ao atingir a cota de filmes coletados.
      if (scoredMovies.size >= limit) {
        break;
      }
    }

    return [...scoredMovies.entries()]
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, limit)
      .map(([movieId, result]) => ({
        movieId,
        score: Number(result.score.toFixed(6)),
        sourceUserId: result.sourceUserId,
        ...this.getMovieOrFallback(movies, movieId)
      }));
  }

  private runModifiedDijkstra(
    graph: UserGraph,
    sourceUserId: string,
    nodeVisitLimit: number
  ): Record<string, number> {
    const distances: Record<string, number> = { [sourceUserId]: 0 };
    const visited = new Set<string>();
    const queue: QueueNode[] = [{ userId: sourceUserId, distance: 0 }];

    while (queue.length > 0 && visited.size <= nodeVisitLimit) {
      queue.sort((a, b) => a.distance - b.distance);
      const current = queue.shift();
      if (!current) {
        break;
      }

      if (visited.has(current.userId)) {
        continue;
      }
      visited.add(current.userId);

      const edges = graph[current.userId] ?? [];
      for (const edge of edges) {
        const candidateDistance = current.distance + edge.weight;

        if (
          distances[edge.to] === undefined ||
          candidateDistance < distances[edge.to]
        ) {
          distances[edge.to] = candidateDistance;
          queue.push({ userId: edge.to, distance: candidateDistance });
        }
      }
    }

    return distances;
  }

  private getUserRatingsOrThrow(
    users: UsersIndex,
    userId: string
  ): Record<string, number> {
    if (!/^\d+$/.test(userId)) {
      throw new UnprocessableEntityException(
        'O id do usuario deve conter apenas numeros.'
      );
    }

    const ratings = users[userId];
    if (!ratings) {
      throw new NotFoundException('Usuario nao encontrado na base de dados.');
    }

    return ratings;
  }

  private getMovieOrFallback(
    movies: Record<string, { title: string; genres: string; imdbId?: string; tmdbId?: string }>,
    movieId: string
  ): { title: string; genres: string; imdbId?: string; tmdbId?: string } {
    return (
      movies[movieId] ?? {
        title: 'Filme desconhecido',
        genres: '(no genres listed)'
      }
    );
  }
}
