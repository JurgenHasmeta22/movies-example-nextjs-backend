import { Episode } from './episode.model';

export interface Serie {
    id?: number;
    title?: string;
    photoSrc?: string;
    releaseYear?: number;
    ratingImdb?: number;
    episodes?: Episode[];
}

export interface SeriePatch {
    title?: string;
    photoSrc?: string;
    releaseYear?: number;
    ratingImdb?: number;
}

export interface SeriePost {
    title: string;
    photoSrc: string;
    releaseYear: number;
    ratingImdb: number;
}
