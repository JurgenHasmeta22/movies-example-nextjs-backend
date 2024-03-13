import { User } from './user';
import { Movie } from './movie';

export interface Favorite {
    id?: number;
    userId?: number;
    movieId?: number;
    user?: User;
    movie?: Movie;
}
