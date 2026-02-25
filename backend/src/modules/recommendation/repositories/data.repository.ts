import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  MoviesIndex,
  UserGraph,
  UsersIndex
} from '../types/recommendation.types';

@Injectable()
export class DataRepository {
  private readonly generatedDir = process.env.GENERATED_DIR
    ? path.resolve(process.env.GENERATED_DIR)
    : path.resolve(process.cwd(), 'data/generated');

  private usersCache: UsersIndex | null = null;
  private moviesCache: MoviesIndex | null = null;
  private graphCache: UserGraph | null = null;

  getUsers(): UsersIndex {
    if (!this.usersCache) {
      this.usersCache = this.loadJsonFile<UsersIndex>('users.json');
    }
    return this.usersCache;
  }

  getMovies(): MoviesIndex {
    if (!this.moviesCache) {
      this.moviesCache = this.loadJsonFile<MoviesIndex>('movies.json');
    }
    return this.moviesCache;
  }

  getGraph(): UserGraph {
    if (!this.graphCache) {
      this.graphCache = this.loadJsonFile<UserGraph>('userGraph.json');
    }
    return this.graphCache;
  }

  private loadJsonFile<T>(filename: string): T {
    const absolutePath = path.join(this.generatedDir, filename);
    if (!existsSync(absolutePath)) {
      throw new InternalServerErrorException(
        `Arquivo de dados ausente: ${filename}. Execute os scripts de build de dados.`
      );
    }

    try {
      const content = readFileSync(absolutePath, 'utf8');
      return JSON.parse(content) as T;
    } catch {
      throw new InternalServerErrorException(
        `Falha ao carregar arquivo de dados: ${filename}`
      );
    }
  }
}
