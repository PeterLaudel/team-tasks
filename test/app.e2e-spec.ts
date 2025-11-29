import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@gmail.com', password: 'testpassword' })
      .expect(201);
  });

  it('/auth/login (POST) - success', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test2@gmail.com', password: 'testpassword200' })
      .expect(201);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test2@gmail.com', password: 'testpassword200' })
      .expect(201)
      .expect({ message: 'Login successful' });
  });

  it('/auth/login (POST) - failure', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test2@gmail.com', password: 'testpassword200' })
      .expect(201);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test2@gmail.com', password: 'testpassword300' })
      .expect(201)
      .expect({ message: 'Invalid credentials' });
  });
});
