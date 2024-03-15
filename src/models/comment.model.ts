import { User } from "./user.model";

export interface Comment {
    id?: number;
    content?: string;
    createdAt?: Date;
    userId?: number;
    user?: User;
  }