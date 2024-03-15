import { Movie } from './movie.model';
import { Genre } from './genre.model';

export interface MovieGenre {
    id?: number;
    movieId?: number;
    genreId?: number;
    movie?: Movie;
    genre?: Genre;
  }