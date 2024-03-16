import { Episode, Prisma } from '@prisma/client';
import { prisma } from '../app';

interface EpisodeServiceParams {
    sortBy: string;
    ascOrDesc: 'asc' | 'desc';
    perPage: number;
    page: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: '>' | '=' | '<' | 'gt' | 'equals' | 'lt';
}

const episodeService = {
    async getEpisodes({
        sortBy,
        ascOrDesc,
        perPage,
        page,
        title,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: EpisodeServiceParams): Promise<Episode[] | null> {
        const filters: any = {};
        const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
        const take = perPage || 20;

        if (title) filters.title = { contains: title };

        if (filterValue !== undefined && filterNameString && filterOperatorString) {
            const operator = filterOperatorString === '>' ? 'gt' : filterOperatorString === '<' ? 'lt' : 'equals';
            filters[filterNameString] = { [operator]: filterValue };
        }

        const orderByObject: any = {};

        if (sortBy && ascOrDesc) {
            orderByObject[sortBy] = ascOrDesc;
        }

        const episodes = await prisma.episode.findMany({
            where: filters,
            include: { season: true },
            orderBy: orderByObject,
            skip,
            take,
        });

        if (episodes) {
            return episodes;
        } else {
            return null;
        }
    },
    async getEpisodeById(episodeId: number): Promise<Episode | null> {
        const result = await prisma.episode.findFirst({
            where: { id: episodeId },
            include: { season: true },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    },
    async getEpisodeByTitle(title: string): Promise<Episode | null> {
        const result = await prisma.episode.findFirst({
            where: { title },
            include: { season: true },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    },
    async updateEpisodeById(episodeParam: Prisma.EpisodeUpdateInput, id: string): Promise<Episode | null> {
        const episode: Episode | null = await prisma.episode.findUnique({
            where: { id: Number(id) },
        });

        if (episode) {
            const episodeUpdated = await prisma.episode.update({
                where: { id: Number(id) },
                data: episodeParam,
                include: { season: true },
            });

            if (episodeUpdated) {
                return episodeUpdated;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async addEpisode(episodeParam: Episode): Promise<Episode | null> {
        const existingSeason = await prisma.season.findUnique({
            where: { id: episodeParam.seasonId },
        });

        if (existingSeason) {
            const episodeCreated = await prisma.episode.create({
                data: {
                    ...episodeParam,
                    season: { connect: { id: existingSeason.id } },
                } as Prisma.EpisodeCreateInput,
                include: { season: true, usersWhoBookmarkedIt: { select: { user: true } } },
            });

            if (episodeCreated) {
                return episodeCreated;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async deleteEpisodeById(id: number): Promise<string | null> {
        const episode: Episode | null = await prisma.episode.findUnique({
            where: { id },
        });

        if (episode) {
            const result = await prisma.episode.delete({
                where: { id },
            });

            if (result) {
                return 'Episode deleted successfully';
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async searchEpisodesByTitle(title: string, page: number): Promise<Episode[] | null> {
        const query = {
            where: {
                title: { contains: title },
            },
            include: { season: true },
            skip: page ? (page - 1) * 20 : 0,
            take: 20,
        };

        const episodes = await prisma.episode.findMany(query);

        if (episodes) {
            return episodes;
        } else {
            return null;
        }
    },
};

export default episodeService;
