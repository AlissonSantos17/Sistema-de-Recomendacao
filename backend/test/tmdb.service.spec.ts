import { TmdbService } from '../src/modules/recommendation/services/tmdb.service';

function createJsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body
  } as Response;
}

describe('TmdbService', () => {
  const originalEnv = process.env;
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...originalEnv,
      TMDB_BEARER_TOKEN: 'test-token',
      TMDB_API_BASE_URL: 'https://api.themoviedb.org',
      TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p'
    };
    (global as typeof globalThis & { fetch: typeof fetch }).fetch =
      fetchMock as unknown as typeof fetch;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('normaliza, ordena e limita retorno para 1 poster', async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        posters: [
          {
            file_path: '/lowest.jpg',
            width: 600,
            height: 900,
            vote_average: 4.1,
            vote_count: 2,
            iso_639_1: 'en'
          },
          {
            file_path: '/older.jpg',
            width: 600,
            height: 900,
            vote_average: 5.4,
            vote_count: 30,
            iso_639_1: 'en'
          },
          {
            file_path: '/best.jpg',
            width: 600,
            height: 900,
            vote_average: 5.6,
            vote_count: 12,
            iso_639_1: 'pt'
          }
        ]
      })
    );

    const service = new TmdbService();
    const result = await service.getMoviePosters(603);

    expect(result.movieId).toBe(603);
    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].filePath).toBe('/best.jpg');
    expect(result.items[0].previewUrl).toBe(
      'https://image.tmdb.org/t/p/w342/best.jpg'
    );
    expect(result.items[0].originalUrl).toBe(
      'https://image.tmdb.org/t/p/original/best.jpg'
    );
  });

  it('retorna vazio quando TMDb falha', async () => {
    fetchMock.mockResolvedValue(createJsonResponse({}, 500));

    const service = new TmdbService();
    const result = await service.getMoviePosters(603);

    expect(result).toEqual({ movieId: 603, total: 0, items: [] });
  });
});
