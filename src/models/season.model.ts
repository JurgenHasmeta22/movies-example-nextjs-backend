import { Serie } from './serie.model';
import { Episode } from './episode.model';
import { User } from './user.model';

interface Season {
    id: number;
    title: string;
    photoSrc: string;
    releaseYear: number;
    ratingImdb: number;
    serieId?: number;
    serie?: Serie;
    episodes?: Episode[];
    usersWhoBookmarkedIt?: User[];
}

export default Season;
