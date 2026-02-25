import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import path from 'node:path';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.GENERATED_DIR = path.resolve(__dirname, 'fixtures');

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('/users/:id/exists (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/users/1/exists');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userId: '1', exists: true });
  });

  it('/users/:id/top-rated (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/users/1/top-rated?limit=1');

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(response.body.items[0].movieId).toBe('10');
  });

  it('/movies/:movieId/posters (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/movies/603/posters');

    expect(response.status).toBe(200);
    expect(response.body.movieId).toBe(603);
    expect(Array.isArray(response.body.items)).toBe(true);
  });
});
