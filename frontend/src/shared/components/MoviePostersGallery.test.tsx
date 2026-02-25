import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MoviePostersGallery from './MoviePostersGallery';

const getMoviePostersMock = vi.fn();

vi.mock('../../services/recommendations', () => ({
  getMoviePosters: (...args: unknown[]) => getMoviePostersMock(...args)
}));

describe('MoviePostersGallery', () => {
  beforeEach(() => {
    getMoviePostersMock.mockReset();
  });

  it('renderiza posters em caso de sucesso', async () => {
    getMoviePostersMock.mockResolvedValue({
      movieId: 603,
      total: 1,
      items: [
        {
          filePath: '/poster.jpg',
          previewUrl: 'https://image.tmdb.org/t/p/w342/poster.jpg',
          originalUrl: 'https://image.tmdb.org/t/p/original/poster.jpg',
          width: 1000,
          height: 1500,
          iso639_1: 'en',
          voteAverage: 5.4,
          voteCount: 10
        }
      ]
    });

    render(<MoviePostersGallery movieId={603} movieTitle="Matrix" />);

    expect(screen.getByText('Carregando poster...')).toBeInTheDocument();
    expect(await screen.findByAltText('Poster de Matrix (en)')).toBeInTheDocument();
  });

  it('renderiza fallback quando nao ha posters', async () => {
    getMoviePostersMock.mockResolvedValue({
      movieId: 603,
      total: 0,
      items: []
    });

    render(<MoviePostersGallery movieId={603} movieTitle="Matrix" />);

    expect(
      await screen.findByText(
        'Nenhum poster disponivel para este filme no momento.'
      )
    ).toBeInTheDocument();
  });

  it('aplica fallback quando request falha', async () => {
    getMoviePostersMock.mockRejectedValue({
      response: {
        status: 500,
        data: {
          message: 'Erro interno'
        }
      }
    });

    render(<MoviePostersGallery movieId={603} movieTitle="Matrix" />);

    expect(
      await screen.findByText(
        'Nenhum poster disponivel para este filme no momento.'
      )
    ).toBeInTheDocument();
  });

  it('ignora requisicao cancelada sem exibir erro de servico', async () => {
    getMoviePostersMock.mockRejectedValue({
      code: 'ERR_CANCELED',
      name: 'CanceledError'
    });

    render(<MoviePostersGallery movieId={603} movieTitle="Matrix" />);

    expect(
      await screen.findByText(
        'Nenhum poster disponivel para este filme no momento.'
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Servico indisponivel no momento. Tente novamente em instantes.')
    ).not.toBeInTheDocument();
  });

  it('renderiza apenas o primeiro poster retornado', async () => {
    getMoviePostersMock.mockResolvedValue({
      movieId: 603,
      total: 2,
      items: [
        {
          filePath: '/poster-1.jpg',
          previewUrl: 'https://image.tmdb.org/t/p/w342/poster-1.jpg',
          originalUrl: 'https://image.tmdb.org/t/p/original/poster-1.jpg',
          width: 1000,
          height: 1500,
          iso639_1: 'en',
          voteAverage: 5.4,
          voteCount: 10
        },
        {
          filePath: '/poster-2.jpg',
          previewUrl: 'https://image.tmdb.org/t/p/w342/poster-2.jpg',
          originalUrl: 'https://image.tmdb.org/t/p/original/poster-2.jpg',
          width: 1000,
          height: 1500,
          iso639_1: 'pt',
          voteAverage: 5.0,
          voteCount: 5
        }
      ]
    });

    render(<MoviePostersGallery movieId={603} movieTitle="Matrix" />);

    expect(await screen.findByAltText('Poster de Matrix (en)')).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w342/poster-1.jpg'
    );
    expect(screen.queryByAltText('Poster de Matrix (pt)')).not.toBeInTheDocument();
  });
});
