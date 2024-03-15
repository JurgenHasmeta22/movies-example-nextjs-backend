import { prisma } from '../app';
import { Serie, SeriePatch, SeriePost } from '../models/serie.model';
import { User } from '../models/user.model';

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

interface SerieServiceResponse {
    rows: Serie[];
    count: number;
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
    }: SerieServiceParams): Promise<SerieServiceResponse> {
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
            include: { seasons: { include: {episodes: true}} },
            orderBy: orderByObject,
            skip,
            take,
        });

        const count = await prisma.serie.count({ where: filters });

        return { rows: series, count };
    },
    async getSerieById(serieId: number): Promise<Serie | null> {
        return await prisma.serie.findFirst({
            where: { id: serieId },
            include: { seasons: { include: {episodes: true}} },
        });
    },
    async getSerieByTitle(title: string): Promise<Serie | null> {
        return await prisma.serie.findFirst({
            where: { title },
            include: { seasons: { include: {episodes: true}} },
        });
    },
    async getLatestSeries(): Promise<Serie[]> {
        return await prisma.serie.findMany({
            orderBy: {
                id: 'desc',
            },
            take: 20,
            include: { seasons: { include: {episodes: true}} },
        });
    },
    // async addSeasonToSerie(seasonId: number, serieId: number): Promise<User | null> {
    //     await prisma.serieSeasons.create({
    //         data: { seasonId, serieId },
    //     });

        
    //     const serie = await prisma.serie.findUnique({
    //         where: { id: serieId },
    //         include: { seasons: { include: {episodes: true}} },
    //     });

    //     if (serie) {
    //         return serie;
    //     } else {
    //         return null;
    //     }
    // },
    async updateSerieById(serieParam: SeriePatch, id: string): Promise<Serie | null> {
        const serie: Serie | null = await prisma.serie.findUnique({
            where: { id: Number(id) },
        });

        if (serie) {
            const serieUpdated = await prisma.serie.update({
                where: { id: Number(id) },
                data: serieParam,
                include: { seasons: { include: {episodes: true}} },
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
    async addSerie(serieParam: SeriePost): Promise<Serie | null> {
        const serieCreated = await prisma.serie.create({
            data: serieParam,
            include: { seasons: { include: {episodes: true}} },
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
                return 'Serie was not deleted';
            }
        } else {
            return null;
        }
    },
    async searchSeriesByTitle(title: string, page: number): Promise<{ series: Serie[]; count: number }> {
        const query = {
            where: {
                title: { contains: title },
            },
            include: { seasons: { include: {episodes: true}} },
            skip: page ? (page - 1) * 20 : 0,
            take: 20,
        };

        const series = await prisma.serie.findMany(query);
        const count = await prisma.serie.count({
            where: {
                title: { contains: title },
            },
        });

        return { series, count };
    },
};

export default serieService;
