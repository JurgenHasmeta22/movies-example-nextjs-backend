import { Serie } from './serie.model';

export interface Episode {
    id: number;
    title: string;
    photoSrc: string;
    videoSrc: string;
    description: string;
    serieId?: number;
    serie?: Serie;
}

export interface EpisodePost {
    title: string;
    photoSrc: string;
    videoSrc: string;
    description: string;
    serieId?: number;
    serie?: Serie;
}

export interface EpisodePatch {
    title?: string;
    photoSrc?: string;
    videoSrc?: string;
    description?: string;
    serieId?: number;
    serie?: Serie;
}
