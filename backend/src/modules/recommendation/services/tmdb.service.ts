import { Injectable, Logger } from '@nestjs/common';
import { MoviePosterItem, MoviePostersResponse } from '../types/tmdb.types';

interface TmdbImageItem {
  file_path?: string;
  width?: number;
  height?: number;
  iso_639_1?: string | null;
  vote_average?: number;
  vote_count?: number;
}

interface TmdbMovieImagesResponse {
  id?: number;
  posters?: TmdbImageItem[];
}

interface GetMoviePostersOptions {
  language?: string;
}

const DEFAULT_API_BASE_URL = 'https://api.themoviedb.org';
const DEFAULT_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const DEFAULT_LANGUAGE = 'pt-BR';
const DEFAULT_INCLUDE_IMAGE_LANGUAGE = 'pt-BR,en,null';
const REQUEST_TIMEOUT_MS = 8000;
const PREVIEW_SIZE = 'w342';
const ORIGINAL_SIZE = 'original';
const MAX_POSTERS_RETURNED = 1;

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);

  async getMoviePosters(
    movieId: number,
    options?: GetMoviePostersOptions
  ): Promise<MoviePostersResponse> {
    const bearerToken = process.env.TMDB_BEARER_TOKEN?.trim();
    if (!bearerToken) {
      this.logger.warn(
        'TMDB_BEARER_TOKEN nao configurado. Retornando lista de posters vazia.'
      );
      return this.emptyResponse(movieId);
    }

    const language = options?.language?.trim() || DEFAULT_LANGUAGE;
    const apiBaseUrl = (
      process.env.TMDB_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
    ).replace(/\/$/, '');
    const imageBaseUrl = (
      process.env.TMDB_IMAGE_BASE_URL?.trim() || DEFAULT_IMAGE_BASE_URL
    ).replace(/\/$/, '');

    const endpoint = new URL(`${apiBaseUrl}/3/movie/${movieId}/images`);
    endpoint.searchParams.set('language', language);
    endpoint.searchParams.set(
      'include_image_language',
      DEFAULT_INCLUDE_IMAGE_LANGUAGE
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          accept: 'application/json'
        },
        signal: controller.signal
      });

      if (!response.ok) {
        this.logger.warn(
          `TMDb retornou status ${response.status} para movieId=${movieId}. Retornando vazio.`
        );
        return this.emptyResponse(movieId);
      }

      const payload = (await response.json()) as TmdbMovieImagesResponse;
      const posters = this.normalizePosters(payload.posters ?? [], imageBaseUrl);

      return {
        movieId,
        total: posters.length,
        items: posters
      };
    } catch (error) {
      this.logger.warn(
        `Falha ao buscar posters TMDb para movieId=${movieId}: ${String(error)}`
      );
      return this.emptyResponse(movieId);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private normalizePosters(
    posters: TmdbImageItem[],
    imageBaseUrl: string
  ): MoviePosterItem[] {
    return posters
      .filter((poster) => typeof poster.file_path === 'string' && poster.file_path)
      .map((poster) => {
        const filePath = poster.file_path as string;
        return {
          filePath,
          previewUrl: `${imageBaseUrl}/${PREVIEW_SIZE}${filePath}`,
          originalUrl: `${imageBaseUrl}/${ORIGINAL_SIZE}${filePath}`,
          width: Number(poster.width ?? 0),
          height: Number(poster.height ?? 0),
          iso639_1: poster.iso_639_1 ?? null,
          voteAverage: Number(poster.vote_average ?? 0),
          voteCount: Number(poster.vote_count ?? 0)
        };
      })
      .sort((a, b) => {
        if (b.voteAverage !== a.voteAverage) {
          return b.voteAverage - a.voteAverage;
        }
        return b.voteCount - a.voteCount;
      })
      .slice(0, MAX_POSTERS_RETURNED);
  }

  private emptyResponse(movieId: number): MoviePostersResponse {
    return {
      movieId,
      total: 0,
      items: []
    };
  }
}
