import { Movie } from './movie';
import { Genre } from './genre';

export interface MovieGenre {
    id?: number;
    movieId?: number;
    genreId?: number;
    movie?: Movie;
    genre?: Genre;
  }