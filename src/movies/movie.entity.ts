import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

export const MovieGenreTransform = {
  from(value: string): Array<string> {
    return value ? value.split('|').map(genre => genre.trim()) : null;
  },
  to(value: Array<string>): string {
    return value ? value.map(genre => genre.trim()).join('|') : null;
  },
};

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    transformer: MovieGenreTransform,
  })
  genres: Array<string>;

  @VersionColumn()
  version: number;
}
