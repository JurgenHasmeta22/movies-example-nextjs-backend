import { prisma } from "@prisma/client";

export const favirtesController = {
  allFavoritesGet: async (req: any, res: any) => {
    const token = req.headers.authorization || "";

    try {
      const user = await getUserFromToken(token);

      const favorites = await prisma.favorite.findMany({
        where: { userId: user?.id },
      });

      res.send(favorites);
    } catch (err) {
      // @ts-ignore
      res.status(400).send({ error: err.message });
    }
  },

  favoritesPost: async (req: any, res: any) => {
    const token = req.headers.authorization || "";
    const { movieId } = req.body;

    try {
      const user = await getUserFromToken(token);

      const favorite = await prisma.favorite.create({
        //@ts-ignore
        data: { userId: user.id, movieId: movieId },
      });

      const favorites = await prisma.favorite.findMany({
        where: { userId: user?.id },
      });

      const generes = await prisma.genre.findMany();
      //@ts-ignore
      user.favMovies = await prisma.movie.findMany({
        where: { id: { in: favorites.map((f) => f.movieId) } },
        include: { genres: { include: { genre: true } } },
      });

      res.send(user);
    } catch (err) {
      // @ts-ignore
      res.status(400).send({ error: err.message });
    }
  },
};
