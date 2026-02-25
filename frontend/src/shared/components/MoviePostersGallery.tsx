import { useCallback, useEffect, useState } from 'react';
import { getMoviePosters } from '../../services/recommendations';
import { MoviePoster } from '../../types/api';

interface MoviePostersGalleryProps {
  movieId: number;
  movieTitle: string;
}

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }

  if (!error || typeof error !== 'object') {
    return false;
  }

  const maybeError = error as { code?: string; name?: string };
  return maybeError.code === 'ERR_CANCELED' || maybeError.name === 'CanceledError';
}

function getPosterAlt(movieTitle: string, poster: MoviePoster): string {
  const language = poster.iso639_1 ? ` (${poster.iso639_1})` : '';
  return `Poster de ${movieTitle}${language}`;
}

export default function MoviePostersGallery({
  movieId,
  movieTitle
}: MoviePostersGalleryProps) {
  const [posters, setPosters] = useState<MoviePoster[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosters = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);

      try {
        const response = await getMoviePosters(movieId, { signal });
        if (signal?.aborted) {
          return;
        }
        setPosters(response.items);
      } catch (caughtError) {
        if (isAbortError(caughtError)) {
          return;
        }
        // Poster nao deve quebrar a experiencia principal do card.
        // Em falhas de rede/timeout/servidor, trata como indisponivel.
        setPosters([]);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [movieId]
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadPosters(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadPosters]);

  if (loading) {
    return (
      <section className="poster-gallery" aria-label={`Poster de ${movieTitle}`}>
        <div className="poster-gallery__featured poster-gallery__featured--loading" />
        <p className="poster-gallery__status">Carregando poster...</p>
      </section>
    );
  }

  if (posters.length === 0) {
    return (
      <p className="poster-gallery__status">
        Nenhum poster disponivel para este filme no momento.
      </p>
    );
  }

  const featuredPoster = posters[0];

  return (
    <section className="poster-gallery" aria-label={`Poster de ${movieTitle}`}>
      <img
        src={featuredPoster.previewUrl}
        alt={getPosterAlt(movieTitle, featuredPoster)}
        className="poster-gallery__featured"
        loading="lazy"
      />
    </section>
  );
}
