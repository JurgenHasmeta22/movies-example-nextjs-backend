import { MovieGenre } from "./movieGenre";

export interface Genre {
  id: number;
  name: string;
  movies?: MovieGenre[];
}