import { MovieGenre } from './movieGenre.model';

export interface Genre {
    id?: number;
    name: string;
    movies?: MovieGenre[];
}
