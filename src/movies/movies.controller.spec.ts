import { Test } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ResourceNotFoundException } from '../exceptions/ResourceNotFoundException';
import { InvalidResourceException } from '../exceptions/InvalidResourceException';

jest.mock('./movies.service');

describe('Movies Controller', () => {
  const MOVIES = [
    { id: 1, title: 'TestTitle1', genres: ['genre1', 'genre2'], version: 1 },
    { id: 2, title: 'TestTitle2', genres: ['genre3'], version: 2 },
  ];

  let app: INestApplication;
  let moviesController: MoviesController;
  let moviesServiceMock: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );

    moviesController = moduleRef.get<MoviesController>(MoviesController);
    moviesServiceMock = moduleRef.get<MoviesService>(MoviesService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(moviesController).toBeDefined();
  });

  /**
   * Tests given movies exists
   */

  describe('given movies', () => {
    beforeEach(() => {
      moviesServiceMock.findAll.mockImplementation(() =>
        Promise.resolve(MOVIES),
      );
      moviesServiceMock.findById.mockImplementation(() =>
        Promise.resolve(MOVIES[0]),
      );
    });

    it('when finding movies, should get movie list', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(MOVIES);
    });

    it('when finding movie, should get movie', () => {
      return request(app.getHttpServer())
        .get('/movies/1')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(MOVIES[0]);
    });
  });

  /**
   * Tests given no movies exists
   */

  describe('given no movies', () => {
    beforeEach(async () => {
      moviesServiceMock.findAll.mockImplementation(() => Promise.resolve([]));
      moviesServiceMock.findById.mockImplementation(() =>
        Promise.reject(new ResourceNotFoundException('Unable to find movie')),
      );
    });

    it('when finding movies, should get movie list', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect([]);
    });

    it('when finding movie, should get status 404', () => {
      return request(app.getHttpServer())
        .get('/movies/1')
        .expect(404)
        .expect('Content-Type', /json/)
        .expect({ statusCode: 404, message: 'Unable to find movie' });
    });
  });

  it('when creating movie, should get created status with location', () => {
    moviesServiceMock.create.mockImplementation(() =>
      Promise.resolve({ id: 3 }),
    );
    return request(app.getHttpServer())
      .post('/movies')
      .send(MOVIES[0])
      .expect(201);
  });

  it('given invalid resource, when creating movie, should get unprocessable entity', () => {
    moviesServiceMock.create.mockImplementation(() =>
      Promise.reject(new InvalidResourceException('Test')),
    );
    return request(app.getHttpServer())
      .post('/movies')
      .send(MOVIES[0])
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect('Content-Type', /json/)
      .expect({ statusCode: HttpStatus.UNPROCESSABLE_ENTITY, message: 'Test' });
  });

  it('given no title, when creating movie, should get unprocessable entity', () => {
    return request(app.getHttpServer())
      .post('/movies')
      .send({ genre: ['1', '2'] })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.message[0]).toContain('title');
      });
  });

  it('given no genres, when creating movie, should get unprocessable entity', () => {
    return request(app.getHttpServer())
      .post('/movies')
      .send({ title: 'Test' })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.message[0]).toContain('genres');
      });
  });
});
