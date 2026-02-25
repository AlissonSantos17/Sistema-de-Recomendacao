import { RecommendedMovie, TopRatedMovie } from '../../types/api';

type Movie = TopRatedMovie | RecommendedMovie;

interface MovieCardProps {
  movie: Movie;
  metricLabel: string;
  metricValue: string;
  extra?: string;
  posterUrl?: string | null;
  posterLoading?: boolean;
}

function getExternalIds(movie: Movie) {
  const ids: string[] = [];
  if (movie.imdbId) {
    ids.push(`IMDb ${movie.imdbId}`);
  }
  if (movie.tmdbId) {
    ids.push(`TMDb ${movie.tmdbId}`);
  }
  return ids.join(' | ');
}

export default function MovieCard({
  movie,
  metricLabel,
  metricValue,
  extra,
  posterUrl,
  posterLoading = false
}: MovieCardProps) {
  const externalIds = getExternalIds(movie);
  const tmdbMovieId = Number(movie.tmdbId);
  const hasValidTmdbId = Number.isInteger(tmdbMovieId) && tmdbMovieId > 0;

  return (
    <article className="movie-card" aria-label={`Filme ${movie.title}`}>
      {hasValidTmdbId ? (
        posterLoading ? (
          <section className="poster-gallery" aria-label={`Poster de ${movie.title}`}>
            <div className="poster-gallery__featured poster-gallery__featured--loading" />
          </section>
        ) : posterUrl ? (
          <section className="poster-gallery" aria-label={`Poster de ${movie.title}`}>
            <img
              src={posterUrl}
              alt={`Poster de ${movie.title}`}
              className="poster-gallery__featured"
              loading="lazy"
            />
          </section>
        ) : (
          <section className="poster-gallery" aria-label={`Poster de ${movie.title}`}>
            <p className="poster-gallery__status">
              Nenhum poster disponivel para este filme no momento.
            </p>
          </section>
        )
      ) : null}
      <div className="movie-card__top">
        <h3>{movie.title}</h3>
        <span className="movie-card__metric">
          {metricLabel}: {metricValue}
        </span>
      </div>
      <p className="movie-card__genres">{movie.genres}</p>
      <p className="movie-card__ids">{externalIds || 'IDs externos indisponiveis'}</p>
      {extra ? <p className="movie-card__extra">{extra}</p> : null}
    </article>
  );
}
