import { Favorite } from './favorite.model';
import { Comment } from './comment.model';

export interface User {
    id: number;
    userName: string;
    email: string;
    password: string;
    comments?: Comment[];
    favMovies?: Favorite[];
  }