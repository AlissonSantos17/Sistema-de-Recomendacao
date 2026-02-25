import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../auth/AuthContext';
import { ApiError } from '../types/api';
import DashboardPage from './DashboardPage';

const topRatedMock = vi.fn();
const recommendationsMock = vi.fn();
const postersMock = vi.fn();

vi.mock('../services/recommendations', () => ({
  getTopRatedMovies: (...args: unknown[]) => topRatedMock(...args),
  getRecommendedMovies: (...args: unknown[]) => recommendationsMock(...args),
  getMoviePosters: (...args: unknown[]) => postersMock(...args)
}));

function renderDashboard() {
  localStorage.setItem('movie-recommender-user-id', '1');
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.clear();
    topRatedMock.mockReset();
    recommendationsMock.mockReset();
    postersMock.mockReset();
    postersMock.mockResolvedValue({ movieId: 603, total: 0, items: [] });
  });

  it('renderiza listas de filmes em caso de sucesso', async () => {
    topRatedMock.mockResolvedValue({
      userId: '1',
      limit: 16,
      total: 1,
      items: [
        {
          movieId: '296',
          title: 'Pulp Fiction',
          genres: 'Crime|Drama',
          rating: 5
        }
      ]
    });
    recommendationsMock.mockResolvedValue({
      userId: '1',
      limit: 16,
      total: 1,
      items: [
        {
          movieId: '2571',
          title: 'Matrix',
          genres: 'Action|Sci-Fi',
          score: 3.429,
          sourceUserId: '12'
        }
      ]
    });

    renderDashboard();

    expect(await screen.findByText('Pulp Fiction')).toBeInTheDocument();
    expect(await screen.findByText('Matrix')).toBeInTheDocument();
  });

  it('renderiza estado vazio quando as listas estao sem filmes', async () => {
    topRatedMock.mockResolvedValue({
      userId: '1',
      limit: 16,
      total: 0,
      items: []
    });
    recommendationsMock.mockResolvedValue({
      userId: '1',
      limit: 16,
      total: 0,
      items: []
    });

    renderDashboard();

    expect(
      await screen.findByText(
        'Você ainda não possui filmes avaliados para este recorte.'
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        'Nao encontramos recomendacoes novas para seu perfil no momento.'
      )
    ).toBeInTheDocument();
  });

  it('renderiza erro amigavel quando a API falha', async () => {
    const error: ApiError = {
      statusCode: 500,
      message: 'Falha interna',
      path: '/users/1/top-rated',
      timestamp: new Date().toISOString()
    };

    topRatedMock.mockRejectedValue(error);
    recommendationsMock.mockRejectedValue(error);

    renderDashboard();

    await waitFor(() => {
      expect(
        screen.getAllByText(
          'Servico indisponivel no momento. Tente novamente em instantes.'
        ).length
      ).toBeGreaterThan(0);
    });
  });
});
