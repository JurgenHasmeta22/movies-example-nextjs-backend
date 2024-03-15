import { Serie } from './serie';

export interface Episode {
    id: number;
    title: string;
    photoSrc: string;
    videoSrc: string;
    description: string;
    serieId: number;
    serie: Serie;
  }