import { User } from './user.model';
import { Movie } from './movie.model';

export interface Favorite {
    id?: number;
    userId?: number;
    movieId?: number;
    user?: User;
    movie?: Movie;
}
