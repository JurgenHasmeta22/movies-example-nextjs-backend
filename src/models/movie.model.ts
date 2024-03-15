import { MovieGenre } from './movieGenre.model';
import { Favorite } from './favorite.model';

export interface Movie {
    id?: number;
    title: string;
    videoSrc: string;
    photoSrc: string;
    trailerSrc: string;
    duration: string;
    ratingImdb: number;
    releaseYear: number;
    description: string;
    views: number;
    genres?: MovieGenre[];
    usersWhoBookmarkedIt?: Favorite[];
}

export interface MoviePatch {
    id?: number;
    title?: string;
    videoSrc?: string;
    photoSrc?: string;
    trailerSrc?: string;
    duration?: string;
    ratingImdb?: number;
    releaseYear?: number;
    description?: string;
    views?: number;
}

export interface MoviePost {
    title: string;
    videoSrc: string;
    photoSrc: string;
    trailerSrc: string;
    duration: string;
    ratingImdb: number;
    releaseYear: number;
    description: string;
    views: number;
}
