import { UnprocessableEntityException } from '@nestjs/common';
import { MoviePostersController } from '../src/modules/recommendation/controllers/movie-posters.controller';
import { TmdbService } from '../src/modules/recommendation/services/tmdb.service';

describe('MoviePostersController', () => {
  const tmdbService = {
    getMoviePosters: jest.fn()
  } as unknown as TmdbService;

  const controller = new MoviePostersController(tmdbService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna posters com movieId valido', async () => {
    (tmdbService.getMoviePosters as jest.Mock).mockResolvedValue({
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
          voteAverage: 5.1,
          voteCount: 10
        }
      ]
    });

    const result = await controller.getMoviePosters('603', 'pt-BR');

    expect(tmdbService.getMoviePosters).toHaveBeenCalledWith(603, {
      language: 'pt-BR'
    });
    expect(result.total).toBe(1);
  });

  it('lanca erro para movieId invalido', async () => {
    expect(() => controller.getMoviePosters('abc')).toThrow(
      UnprocessableEntityException
    );
  });
});
