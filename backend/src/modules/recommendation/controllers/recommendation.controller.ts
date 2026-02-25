import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
import { LimitQueryDto } from '../dto/limit-query.dto';
import { RecommendationService } from '../services/recommendation.service';

@ApiTags('users')
@Controller('users')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @ApiOperation({ summary: 'Valida se o usuario existe na base' })
  @ApiParam({ name: 'id', description: 'ID numerico do usuario', example: '1' })
  @ApiOkResponse({
    description: 'Resultado da validacao',
    schema: {
      example: {
        userId: '1',
        exists: true
      }
    }
  })
  @Get(':id/exists')
  userExists(@Param('id') id: string): { userId: string; exists: boolean } {
    return {
      userId: id,
      exists: this.recommendationService.userExists(id)
    };
  }

  @ApiOperation({ summary: 'Lista os filmes mais bem avaliados por um usuario' })
  @ApiParam({ name: 'id', description: 'ID numerico do usuario', example: '1' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade maxima de filmes',
    example: 16
  })
  @ApiOkResponse({
    description: 'Lista de filmes mais bem avaliados',
    schema: {
      example: {
        userId: '1',
        limit: 16,
        total: 2,
        items: [
          {
            movieId: '296',
            title: 'Pulp Fiction (1994)',
            genres: 'Comedy|Crime|Drama|Thriller',
            imdbId: '0110912',
            tmdbId: '680',
            rating: 5
          }
        ]
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Usuario nao encontrado na base' })
  @ApiUnprocessableEntityResponse({ description: 'ID invalido (nao numerico)' })
  @Get(':id/top-rated')
  topRated(@Param('id') id: string, @Query() query: LimitQueryDto) {
    const items = this.recommendationService.getTopRatedMovies(id, query.limit);
    return {
      userId: id,
      limit: query.limit,
      total: items.length,
      items
    };
  }

  @ApiOperation({ summary: 'Retorna recomendacoes de filmes por grafo + Dijkstra modificado' })
  @ApiParam({ name: 'id', description: 'ID numerico do usuario', example: '1' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade maxima de recomendacoes',
    example: 16
  })
  @ApiOkResponse({
    description: 'Lista de filmes recomendados',
    schema: {
      example: {
        userId: '1',
        limit: 16,
        total: 2,
        items: [
          {
            movieId: '2571',
            title: 'Matrix, The (1999)',
            genres: 'Action|Sci-Fi|Thriller',
            imdbId: '0133093',
            tmdbId: '603',
            score: 3.429,
            sourceUserId: '12'
          }
        ]
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Usuario nao encontrado na base' })
  @ApiUnprocessableEntityResponse({ description: 'ID invalido (nao numerico)' })
  @Get(':id/recommendations')
  recommendations(@Param('id') id: string, @Query() query: LimitQueryDto) {
    const items = this.recommendationService.getRecommendations(id, query.limit);
    return {
      userId: id,
      limit: query.limit,
      total: items.length,
      items
    };
  }
}
