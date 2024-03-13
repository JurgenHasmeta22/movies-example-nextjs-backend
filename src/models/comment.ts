import { User } from "./user";

export interface Comment {
    id?: number;
    content?: string;
    createdAt?: Date;
    userId?: number;
    user?: User;
  }