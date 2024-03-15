import { Episode } from './episode.model';

export interface Serie {
    id: number;
    title: string;
    photoSrc: string;
    releaseYear: number;
    ratingImdb: number;
    episodes: Episode[];
  }