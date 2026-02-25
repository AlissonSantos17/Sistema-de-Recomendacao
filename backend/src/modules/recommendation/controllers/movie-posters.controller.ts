import {
  Controller,
  Get,
  Param,
  Query,
  UnprocessableEntityException
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { TmdbService } from '../services/tmdb.service';

@ApiTags('movies')
@Controller('movies')
export class MoviePostersController {
  constructor(private readonly tmdbService: TmdbService) {}

  @ApiOperation({ summary: 'Retorna posters de um filme via TMDb' })
  @ApiParam({
    name: 'movieId',
    description: 'ID numerico do filme no TMDb',
    example: 603
  })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Idioma preferencial dos posters (ISO 639-1 + regiao)',
    example: 'pt-BR'
  })
  @ApiOkResponse({
    description: 'Lista de posters normalizada',
    schema: {
      example: {
        movieId: 603,
        total: 1,
        items: [
          {
            filePath: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            previewUrl:
              'https://image.tmdb.org/t/p/w342/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            originalUrl:
              'https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            width: 2000,
            height: 3000,
            iso639_1: 'en',
            voteAverage: 5.5,
            voteCount: 12
          }
        ]
      }
    }
  })
  @Get(':movieId/posters')
  getMoviePosters(
    @Param('movieId') movieIdParam: string,
    @Query('language') language?: string
  ) {
    const movieId = Number(movieIdParam);
    if (!Number.isInteger(movieId) || movieId <= 0) {
      throw new UnprocessableEntityException(
        'O movieId deve ser um numero inteiro positivo.'
      );
    }

    return this.tmdbService.getMoviePosters(movieId, { language });
  }
}
