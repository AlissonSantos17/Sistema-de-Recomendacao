import { api } from './api';
import { normalizeApiError } from './error';
import {
  ExistsResponse,
  HealthResponse,
  ListResponse,
  MoviePostersResponse,
  RecommendedMovie,
  TopRatedMovie
} from '../types/api';

function sanitizeLimit(limit: number) {
  return Math.min(100, Math.max(1, Number(limit) || 16));
}

async function request<T>(callback: () => Promise<{ data: T }>): Promise<T> {
  try {
    const result = await callback();
    return result.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export function getHealth() {
  return request<HealthResponse>(() => api.get('/health'));
}

export function checkUserExists(userId: string) {
  return request<ExistsResponse>(() => api.get(`/users/${userId}/exists`));
}

export function getTopRatedMovies(userId: string, limit = 16) {
  return request<ListResponse<TopRatedMovie>>(() =>
    api.get(`/users/${userId}/top-rated`, {
      params: { limit: sanitizeLimit(limit) }
    })
  );
}

export function getRecommendedMovies(userId: string, limit = 16) {
  return request<ListResponse<RecommendedMovie>>(() =>
    api.get(`/users/${userId}/recommendations`, {
      params: { limit: sanitizeLimit(limit) }
    })
  );
}

interface GetMoviePostersOptions {
  signal?: AbortSignal;
  language?: string;
}

export function getMoviePosters(
  movieId: number,
  options?: GetMoviePostersOptions
) {
  return request<MoviePostersResponse>(() =>
    api.get(`/movies/${movieId}/posters`, {
      signal: options?.signal,
      params: options?.language ? { language: options.language } : undefined
    })
  );
}
