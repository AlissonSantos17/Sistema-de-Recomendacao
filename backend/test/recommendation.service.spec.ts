import { RecommendationService } from '../src/modules/recommendation/services/recommendation.service';
import { DataRepository } from '../src/modules/recommendation/repositories/data.repository';

describe('RecommendationService', () => {
  const users = {
    '1': { '10': 4.5, '11': 3.0 },
    '2': { '10': 4.0, '12': 5.0, '13': 4.5 },
    '3': { '11': 4.0, '14': 5.0, '12': 3.5 }
  };

  const movies = {
    '10': { title: 'Movie Ten', genres: 'Action' },
    '11': { title: 'Movie Eleven', genres: 'Drama' },
    '12': { title: 'Movie Twelve', genres: 'Comedy' },
    '13': { title: 'Movie Thirteen', genres: 'Sci-Fi' },
    '14': { title: 'Movie Fourteen', genres: 'Adventure' }
  };

  const graph = {
    '1': [{ to: '2', weight: 0.4 }, { to: '3', weight: 1.2 }],
    '2': [{ to: '1', weight: 0.4 }, { to: '3', weight: 0.9 }],
    '3': [{ to: '1', weight: 1.2 }, { to: '2', weight: 0.9 }]
  };

  const repository = {
    getUsers: jest.fn(() => users),
    getMovies: jest.fn(() => movies),
    getGraph: jest.fn(() => graph)
  } as unknown as DataRepository;

  const service = new RecommendationService(repository);

  it('retorna top rated ordenado por nota', () => {
    const result = service.getTopRatedMovies('1', 1);

    expect(result).toHaveLength(1);
    expect(result[0].movieId).toBe('10');
    expect(result[0].rating).toBe(4.5);
  });

  it('retorna recomendacoes sem filmes ja vistos', () => {
    const result = service.getRecommendations('1', 2);

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.movieId)).not.toContain('10');
    expect(result.map((item) => item.movieId)).not.toContain('11');
  });
});
