export type UserRatings = Record<string, number>;
export type UsersIndex = Record<string, UserRatings>;

export interface MovieRecord {
  title: string;
  genres: string;
  imdbId?: string;
  tmdbId?: string;
}

export type MoviesIndex = Record<string, MovieRecord>;

export interface GraphEdge {
  to: string;
  weight: number;
}

export type UserGraph = Record<string, GraphEdge[]>;

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
