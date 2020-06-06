import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDto } from './movie.dto';
import { Movie } from './movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  findAll(): Promise<MovieDto[]> {
    return this.movieService.findAll().then(movies => {
      return movies.map(movie => this.dtoFromEntity(movie));
    });
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<MovieDto> {
    return this.movieService.findById(id).then(this.dtoFromEntity);
  }

  @Post()
  async create(@Body() movie: MovieDto) {
    await this.movieService.create(this.entityFromDto(movie));
  }

  // In a real life scenario the mapper would be a different object
  // for testability reasons.

  /**
   * Maps a Movie to an MovieDto.
   * @param entity The Movie entity to map
   * @return A MovieDto
   */
  private dtoFromEntity(entity: Movie): MovieDto {
    return { ...entity };
  }

  /**
   * Maps a MovieDto to a Movie.
   * @param dto   The MovieDto to map
   * @return A Movie
   */
  private entityFromDto(dto: MovieDto): Movie {
    return { ...dto };
  }
}
