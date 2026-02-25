import { Module } from '@nestjs/common';
import { MoviePostersController } from './controllers/movie-posters.controller';
import { RecommendationController } from './controllers/recommendation.controller';
import { DataRepository } from './repositories/data.repository';
import { RecommendationService } from './services/recommendation.service';
import { TmdbService } from './services/tmdb.service';

@Module({
  controllers: [RecommendationController, MoviePostersController],
  providers: [DataRepository, RecommendationService, TmdbService]
})
export class RecommendationModule {}
