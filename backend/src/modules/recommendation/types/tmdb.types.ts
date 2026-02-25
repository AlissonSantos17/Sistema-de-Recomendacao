export interface MoviePosterItem {
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
  items: MoviePosterItem[];
}
