import { Favorite } from './favorite';
import { Comment } from './comment';

export interface User {
    id: number;
    userName: string;
    email: string;
    password: string;
    comments?: Comment[];
    favMovies?: Favorite[];
  }