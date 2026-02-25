import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import EmptyState from '../shared/components/EmptyState';
import ErrorState from '../shared/components/ErrorState';
import Header from '../shared/components/Header';
import MovieCard from '../shared/components/MovieCard';
import Section from '../shared/components/Section';
import SkeletonGrid from '../shared/components/SkeletonGrid';
import { getFriendlyErrorMessage } from '../services/error';
import {
  getMoviePosters,
  getRecommendedMovies,
  getTopRatedMovies
} from '../services/recommendations';
import { ApiError, RecommendedMovie, TopRatedMovie } from '../types/api';

interface SectionState<T> {
  data: T[];
  loading: boolean;
  error: string;
}

const LIMIT_OPTIONS = [8, 16, 32];

function getValidTmdbId(tmdbId?: string): number | null {
  const numericTmdbId = Number(tmdbId);
  if (!Number.isInteger(numericTmdbId) || numericTmdbId <= 0) {
    return null;
  }
  return numericTmdbId;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { userId, logout } = useAuth();
  const [limit, setLimit] = useState<number>(16);

  const [topRatedState, setTopRatedState] = useState<SectionState<TopRatedMovie>>(
    {
      data: [],
      loading: true,
      error: ''
    }
  );
  const [recommendationState, setRecommendationState] = useState<
    SectionState<RecommendedMovie>
  >({
    data: [],
    loading: true,
    error: ''
  });
  const [posterByTmdbId, setPosterByTmdbId] = useState<Record<number, string | null>>({});
  const [posterLoadingByTmdbId, setPosterLoadingByTmdbId] = useState<
    Record<number, boolean>
  >({});

  async function loadTopRated() {
    setTopRatedState((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const result = await getTopRatedMovies(userId, limit);
      setTopRatedState({ data: result.items, loading: false, error: '' });
    } catch (error) {
      const message = getFriendlyErrorMessage(error as ApiError);
      setTopRatedState({ data: [], loading: false, error: message });
    }
  }

  async function loadRecommendations() {
    setRecommendationState((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const result = await getRecommendedMovies(userId, limit);
      setRecommendationState({ data: result.items, loading: false, error: '' });
    } catch (error) {
      const message = getFriendlyErrorMessage(error as ApiError);
      setRecommendationState({ data: [], loading: false, error: message });
    }
  }

  useEffect(() => {
    void loadTopRated();
    void loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, limit]);

  useEffect(() => {
    const allMovies = [...topRatedState.data, ...recommendationState.data];
    const uniqueTmdbIds = [...new Set(allMovies.map((movie) => getValidTmdbId(movie.tmdbId)))];
    const pendingTmdbIds = uniqueTmdbIds
      .filter((tmdbId): tmdbId is number => tmdbId !== null)
      .filter(
        (tmdbId) =>
          posterByTmdbId[tmdbId] === undefined && !posterLoadingByTmdbId[tmdbId]
      );

    if (pendingTmdbIds.length === 0) {
      return;
    }

    setPosterLoadingByTmdbId((previous) => {
      const next = { ...previous };
      for (const tmdbId of pendingTmdbIds) {
        next[tmdbId] = true;
      }
      return next;
    });

    for (const tmdbId of pendingTmdbIds) {
      void getMoviePosters(tmdbId)
        .then((result) => {
          const firstPoster = result.items[0]?.previewUrl ?? null;
          setPosterByTmdbId((previous) => ({ ...previous, [tmdbId]: firstPoster }));
        })
        .catch(() => {
          setPosterByTmdbId((previous) => ({ ...previous, [tmdbId]: null }));
        })
        .finally(() => {
          setPosterLoadingByTmdbId((previous) => ({ ...previous, [tmdbId]: false }));
        });
    }
  }, [
    recommendationState.data,
    posterByTmdbId,
    posterLoadingByTmdbId,
    topRatedState.data
  ]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <main className="app-shell">
      <Header userId={userId} onLogout={handleLogout} />

      <Section
        title="Filmes mais bem avaliados por você"
        action={
          <label className="limit-control">
            <span>Limite</span>
            <select
              aria-label="Selecionar limite de filmes"
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
            >
              {LIMIT_OPTIONS.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        }
      >
        {topRatedState.loading ? <SkeletonGrid amount={limit} /> : null}
        {!topRatedState.loading && topRatedState.error ? (
          <ErrorState message={topRatedState.error} onRetry={loadTopRated} />
        ) : null}
        {!topRatedState.loading &&
        !topRatedState.error &&
        topRatedState.data.length === 0 ? (
          <EmptyState message="Você ainda não possui filmes avaliados para este recorte." />
        ) : null}
        {!topRatedState.loading &&
        !topRatedState.error &&
        topRatedState.data.length > 0 ? (
          <div className="movies-grid">
            {topRatedState.data.map((movie) => (
              (() => {
                const tmdbId = getValidTmdbId(movie.tmdbId);
                return (
              <MovieCard
                key={movie.movieId}
                movie={movie}
                metricLabel="Nota"
                metricValue={movie.rating.toFixed(1)}
                posterUrl={tmdbId ? posterByTmdbId[tmdbId] ?? null : null}
                posterLoading={
                  tmdbId
                    ? posterByTmdbId[tmdbId] === undefined ||
                      Boolean(posterLoadingByTmdbId[tmdbId])
                    : false
                }
              />
                );
              })()
            ))}
          </div>
        ) : null}
      </Section>

      <Section title="Recomendados para você">
        {recommendationState.loading ? <SkeletonGrid amount={limit} /> : null}
        {!recommendationState.loading && recommendationState.error ? (
          <ErrorState
            message={recommendationState.error}
            onRetry={loadRecommendations}
          />
        ) : null}
        {!recommendationState.loading &&
        !recommendationState.error &&
        recommendationState.data.length === 0 ? (
          <EmptyState message="Nao encontramos recomendacoes novas para seu perfil no momento." />
        ) : null}
        {!recommendationState.loading &&
        !recommendationState.error &&
        recommendationState.data.length > 0 ? (
          <div className="movies-grid">
            {recommendationState.data.map((movie) => (
              (() => {
                const tmdbId = getValidTmdbId(movie.tmdbId);
                return (
              <MovieCard
                key={movie.movieId}
                movie={movie}
                metricLabel="Score"
                metricValue={movie.score.toFixed(3)}
                extra={`Baseado em comportamento similar do usuario #${movie.sourceUserId}`}
                posterUrl={tmdbId ? posterByTmdbId[tmdbId] ?? null : null}
                posterLoading={
                  tmdbId
                    ? posterByTmdbId[tmdbId] === undefined ||
                      Boolean(posterLoadingByTmdbId[tmdbId])
                    : false
                }
              />
                );
              })()
            ))}
          </div>
        ) : null}
      </Section>
    </main>
  );
}
