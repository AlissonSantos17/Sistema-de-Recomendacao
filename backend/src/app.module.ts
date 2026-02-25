import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';

@Module({
  imports: [HealthModule, RecommendationModule]
})
export class AppModule {}
