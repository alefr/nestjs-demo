import { IsDefined, IsNotEmpty } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class MovieDto {
  @ApiProperty()
  id?: number;

  @IsNotEmpty()
  title: string;

  @IsDefined()
  genres: Array<string>;

  version: number;
}
