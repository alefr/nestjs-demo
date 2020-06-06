import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { ResourceNotFoundException } from '../exceptions/ResourceNotFoundException';
import { InvalidResourceException } from '../exceptions/InvalidResourceException';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie) private moviesRepository: Repository<Movie>,
  ) {}

  findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  findById(id: number): Promise<Movie> {
    return this.moviesRepository.findOne(id).then(movie => {
      return movie
        ? movie
        : Promise.reject(
            new ResourceNotFoundException(
              `Unable to find movie with id [${id}]`,
            ),
          );
    });
  }

  create(movie: Movie): Promise<Movie> {
    if (movie.id != null || movie.id != undefined) {
      return Promise.reject(
        new InvalidResourceException(
          'Should not set id explicitly when creating movie, will be generated',
        ),
      );
    }

    // Don't know if typeorm have a problem with sqlite in memory,
    // version=null doesnt seem to work either even though Typeorm states that
    // it should be created:
    // https://typeorm.io/#/entities/special-columns
    const newMovie = { ...movie };
    newMovie.version = movie.version || 0;
    return this.moviesRepository.save(newMovie);
  }
}
