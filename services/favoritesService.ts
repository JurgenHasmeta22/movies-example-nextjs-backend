import { prisma } from "@prisma/client";

export const favoritesService = {
  findManyFavorites: async (id: number) => {
    // @ts-ignore
    return await prisma.favorite.findMany({
      // @ts-ignore
      where: { userId: user?.id },
    });
  },

  createFavorite: async (token: string) => {
    return await prisma.favorite.create({
      //@ts-ignore
      data: { userId: user.id, movieId: movieId },
    });
  },

  findFavoriteMovies: async (token: string) => {
    return await prisma.movie.findMany({
      where: { id: { in: favorites.map((f) => f.movieId) } },
      include: { genres: { include: { genre: true } } },
    });
  },
};
