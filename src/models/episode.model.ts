import Season from './season.model';

export interface Episode {
    id?: number;
    title: string;
    photoSrc: string;
    videoSrc: string;
    description: string;
    seasonId?: number;
    season?: Season;
}

export interface EpisodePost {
    title: string;
    photoSrc: string;
    videoSrc: string;
    description: string;
    seasonId?: number;
}

export interface EpisodePatch {
    title?: string;
    photoSrc?: string;
    videoSrc?: string;
    description?: string;
    seasonId?: number;
}
