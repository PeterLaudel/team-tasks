import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';
import cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  const JWT_SECRET = process.env.JWT_SECRET;
  const testJwtSecret = 'testsecretkey';

  const jwtService = new JwtService({
    secret: testJwtSecret,
    signOptions: { expiresIn: '1h' },
  });

  beforeEach(async () => {
    process.env.JWT_SECRET = testJwtSecret;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterEach(async () => {
    process.env.JWT_SECRET = JWT_SECRET;
    await app.close();
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
      .expect((res) => {
        const body = jwtService.verify(res.body.accessToken, {
          secret: testJwtSecret,
        });
        expect(body).toEqual({
          email: 'test2@gmail.com',
          iat: expect.any(Number),
          exp: expect.any(Number),
          id: expect.any(Number),
        });
      });
  });

  it('/auth/login (POST) - failure', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test2@gmail.com', password: 'testpassword200' })
      .expect(201);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test2@gmail.com', password: 'testpassword300' })
      .expect(404);
  });

  it('/auth/refresh (POST) - success', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test2@gmail.com', password: 'testpassword200' })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test2@gmail.com', password: 'testpassword200' })
      .expect(201);

    const cookies = loginResponse.get('Set-Cookie');
    expect(cookies).toBeDefined();
    const refreshTokenCookie = cookies!.find((cookie) =>
      cookie.startsWith('refreshToken='),
    );
    refreshTokenCookie!.split(';').find((entry) => {
      const [key, value] = entry.split('=');
      if (key === 'refreshToken') {
        expect(value).toBeDefined();
        return  value;
      }
    });
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', refreshTokenCookie!)
      .expect(201)
      .expect((res) => {
        const body = jwtService.verify(res.body.accessToken, {
          secret: testJwtSecret,
        });
        expect(body).toEqual({
          email: 'test2@gmail.com',
          iat: expect.any(Number),
          exp: expect.any(Number),
          id: expect.any(Number),
        });
      });
  });
});
