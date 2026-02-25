import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Verifica saude da API' })
  @ApiOkResponse({
    description: 'Servico operacional',
    schema: {
      example: {
        status: 'ok',
        service: 'movie-recommendation-backend',
        version: '2.0.0'
      }
    }
  })
  @Get()
  getHealth(): { status: string; service: string; version: string } {
    return {
      status: 'ok',
      service: 'movie-recommendation-backend',
      version: '2.0.0'
    };
  }
}
