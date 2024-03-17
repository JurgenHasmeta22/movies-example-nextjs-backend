import { Season, Serie, Prisma } from '@prisma/client';
import { prisma } from '../app';

interface SerieServiceParams {
    sortBy: string;
    ascOrDesc: 'asc' | 'desc';
    perPage: number;
    page: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: '>' | '=' | '<' | 'gt' | 'equals' | 'lt';
}

const serieService = {
    async getSeries({
        sortBy,
        ascOrDesc,
        perPage,
        page,
        title,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: SerieServiceParams): Promise<Serie[] | null> {
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

        const series = await prisma.serie.findMany({
            where: filters,
            include: { seasons: { include: { episodes: true } } },
            orderBy: orderByObject,
            skip,
            take,
        });

        if (series) {
            return series;
        } else {
            return null;
        }
    },
    async getSerieById(serieId: number): Promise<Serie | null> {
        const result = await prisma.serie.findFirst({
            where: { id: serieId },
            include: { seasons: { include: { episodes: true } } },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    },
    async getSerieByTitle(title: string): Promise<Serie | null> {
        const result = await prisma.serie.findFirst({
            where: { title },
            include: { seasons: { include: { episodes: true } } },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    },
    async getLatestSeries(): Promise<Serie[] | null> {
        const result = await prisma.serie.findMany({
            orderBy: {
                id: 'desc',
            },
            take: 20,
            include: { seasons: { include: { episodes: true } } },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    },
    async updateSerieById(serieParam: Prisma.SerieUpdateInput, id: string): Promise<Serie | null> {
        const serie: Serie | null = await prisma.serie.findUnique({
            where: { id: Number(id) },
        });

        if (serie) {
            const serieUpdated = await prisma.serie.update({
                where: { id: Number(id) },
                data: serieParam,
                include: { seasons: { include: { episodes: true } } },
            });

            if (serieUpdated) {
                return serieUpdated;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async addSerie(serieParam: Prisma.SerieCreateInput): Promise<Serie | null> {
        const serieCreated = await prisma.serie.create({
            data: serieParam,
            include: { seasons: { include: { episodes: true } } },
        });

        if (serieCreated) {
            return serieCreated;
        } else {
            return null;
        }
    },
    async deleteSerieById(id: number): Promise<string | null> {
        const serie: Serie | null = await prisma.serie.findUnique({
            where: { id },
        });

        if (serie) {
            const result = await prisma.serie.delete({
                where: { id },
            });

            if (result) {
                return 'Serie deleted successfully';
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async searchSeriesByTitle(title: string, page: number): Promise<Serie[] | null> {
        const query = {
            where: {
                title: { contains: title },
            },
            include: { seasons: { include: { episodes: true } } },
            skip: page ? (page - 1) * 20 : 0,
            take: 20,
        };

        const series = await prisma.serie.findMany(query);

        if (series) {
            return series;
        } else {
            return null;
        }
    },
    async addSeasonToSerie(serieId: number, seasonId: number): Promise<Serie | null> {
        const season: Season | null = await prisma.season.findUnique({
            where: { id: Number(seasonId) },
        });

        if (season) {
            await prisma.season.update({
                where: { id: Number(seasonId) },
                data: { serie: { connect: { id: serieId } } },
            });

            const serie = await prisma.serie.findUnique({
                where: { id: serieId },
                include: { seasons: { include: { episodes: true } }, usersWhoBookmarkedIt: { select: { user: true } } },
            });

            if (serie) {
                return serie;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
};

export default serieService;
