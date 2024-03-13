import { Episode } from './episode';

export interface Serie {
    id: number;
    title: string;
    photoSrc: string;
    releaseYear: number;
    ratingImdb: number;
    episodes: Episode[];
  }