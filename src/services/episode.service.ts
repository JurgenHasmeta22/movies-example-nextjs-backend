import { Season } from '@prisma/client';
import { prisma } from '../app';
import { Episode, EpisodePatch, EpisodePost } from '../models/episode.model';

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
    }: EpisodeServiceParams): Promise<Episode[]> {
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

        return episodes;
    },
    async getEpisodeById(episodeId: number): Promise<Episode | null> {
        return await prisma.episode.findFirst({
            where: { id: episodeId },
            include: { season: true },
        });
    },
    async getEpisodeByTitle(title: string): Promise<Episode | null> {
        return await prisma.episode.findFirst({
            where: { title },
            include: { season: true },
        });
    },
    async updateEpisodeById(episodeParam: EpisodePatch, id: string): Promise<Episode | null> {
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
    async addEpisode(episodeParam: EpisodePost): Promise<Episode | null> {
        const episodeCreated = await prisma.episode.create({
            data: episodeParam,
            include: { season: true },
        });

        if (episodeCreated) {
            return episodeCreated;
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
                return 'Episode was not deleted';
            }
        } else {
            return null;
        }
    },
    async searchEpisodesByTitle(title: string, page: number): Promise<Episode[]> {
        const query = {
            where: {
                title: { contains: title },
            },
            include: { season: true },
            skip: page ? (page - 1) * 20 : 0,
            take: 20,
        };

        const episodes = await prisma.episode.findMany(query);
        return episodes;
    },
};

export default episodeService;
