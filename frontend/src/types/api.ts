export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface ExistsResponse {
  userId: string;
  exists: boolean;
}

export interface TopRatedMovie {
  movieId: string;
  title: string;
  genres: string;
  imdbId?: string;
  tmdbId?: string;
  rating: number;
}

export interface RecommendedMovie {
  movieId: string;
  title: string;
  genres: string;
  imdbId?: string;
  tmdbId?: string;
  score: number;
  sourceUserId: string;
}

export interface MoviePoster {
  filePath: string;
  previewUrl: string;
  originalUrl: string;
  width: number;
  height: number;
  iso639_1: string | null;
  voteAverage: number;
  voteCount: number;
}

export interface MoviePostersResponse {
  movieId: number;
  total: number;
  items: MoviePoster[];
}

export interface ListResponse<T> {
  userId: string;
  limit: number;
  total: number;
  items: T[];
}

export interface ApiError {
  statusCode: number;
  path: string;
  timestamp: string;
  message: string;
}
