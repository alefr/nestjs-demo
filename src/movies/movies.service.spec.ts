import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { InvalidResourceException } from '../exceptions/InvalidResourceException';

const schemaSql =
  'CREATE TABLE movies(\n' +
  '   id      ROWID \n' +
  '  ,title   VARCHAR(255) NOT NULL\n' +
  '  ,genres  VARCHAR(255)\n' +
  '  ,version INT NOT NULL default 0\n' +
  ');';

const dataSql = `INSERT INTO movies(id,title,genres) VALUES (1,'Test1','genre11|genre12|genre13'), (2,'Test2','genre21');`;

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Movie],
          synchronize: false,
          logging: false,
        }),
        TypeOrmModule.forFeature([Movie]),
      ],
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>('MovieRepository');
    await repository.query(schemaSql);
  });

  afterEach(async () => {
    // Cleanup db
    await repository.query('delete from movies;');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('given existing movies', () => {
    beforeEach(async () => {
      // Populate db
      await repository.query(dataSql);
    });

    it('when searching for all, should get all', async () => {
      const movies = await service.findAll();
      expect(movies).toHaveLength(2);
      expect(movies[0]).toEqual(
        expect.objectContaining({
          id: 1,
          title: 'Test1',
          version: 0,
          genres: ['genre11', 'genre12', 'genre13'],
        }),
      );
      expect(movies[1]).toEqual(
        expect.objectContaining({
          id: 2,
          title: 'Test2',
          version: 0,
          genres: ['genre21'],
        }),
      );
    });

    it('when finding by id, should get movie', async () => {
      const movie = await service.findById(1);
      expect(movie).toEqual(
        expect.objectContaining({
          id: 1,
          title: 'Test1',
          version: 0,
          genres: ['genre11', 'genre12', 'genre13'],
        }),
      );
    });
  });

  describe('given no existing movies', () => {
    it('when searching for all, should get empty list', async () => {
      const movies = await service.findAll();
      expect(movies).toHaveLength(0);
    });

    it('when finding by id, should get error', async () => {
      await expect(service.findById(3)).rejects.toThrow('3');
    });
  });

  describe('given movie', () => {
    const MOVIE = {
      id: null,
      title: 'TestTitle',
      genres: ['genre1', 'genre2'],
      version: 0,
    };
    const MOVIE_WITH_ID = {
      id: 3,
      title: 'TestTitle',
      genres: ['genre1', 'genre2'],
      version: 0,
    };

    it('when creating movie, should generate id', async () => {
      const movie = await service.create(MOVIE);
      expect(movie.id).toBeTruthy();
    });

    // Currently fails, have a open question on typeorm:
    // https://github.com/typeorm/typeorm/issues/5903
    // it('when creating movie, should be searchable', async () => {
    //   const expected = await service.create(MOVIE);
    //   const actual = await service.findById(expected.id);
    //   expect(actual).toEqual(expect.objectContaining(expected));
    // });

    it('when creating movie, should contain version', async () => {
      const movie = new Movie();
      movie.title = 'TestTitle';
      movie.version = null;

      const savedMovie = await service.create(movie);
      expect(savedMovie.version).toEqual(0);
    });

    it('when creating movie, should not edit original movie', async () => {
      const movie = await service.create(MOVIE);
      expect(movie.id).not.toEqual(MOVIE.id);
    });

    it('when creating movie with id, should throw InvalidResourceExeption', async () => {
      await expect(service.create(MOVIE_WITH_ID)).rejects.toThrow(
        InvalidResourceException,
      );
    });

    it('when creating movie with id, should throw with id in message', async () => {
      await expect(service.create(MOVIE_WITH_ID)).rejects.toThrow('id');
    });
  });
});
