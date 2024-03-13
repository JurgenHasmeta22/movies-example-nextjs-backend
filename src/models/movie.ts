import { MovieGenre } from './movieGenre';
import { Favorite } from './favorite';

export interface Movie {
    id: number;
    title: string;
    videoSrc: string;
    photoSrc: string;
    trailerSrc: string;
    duration: string;
    ratingImdb: number;
    releaseYear: number;
    description: string;
    views: number;
    genres: MovieGenre[];
    userWhoBookmarkedIt: Favorite[];
  }