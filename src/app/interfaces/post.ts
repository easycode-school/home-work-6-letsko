import { Comment } from './comment';

export interface Post {
    userId: number | string;
    id: number;
    title: string;
    body: string;
    comments?: Comment[];
}
