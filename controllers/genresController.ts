import { prisma } from "@prisma/client";

export const genresController = {
  allGenresGet: async (req: any, res: any) => {
    try {
      // @ts-ignore
      const genres = await prisma.genre.findMany();
      res.send(genres);
    } catch (err) {
      // @ts-ignore
      res.status(400).send({ error: err.message });
    }
  },

  singleGenreGet: async (req: any, res: any) => {
    const genre = req.params.genre;
    let page = Number(req.query.page);

    // @ts-ignore
    const genreId = await prisma.genre.findFirst({
      where: { name: genre },
    });

    // @ts-ignore
    const count = await prisma.movieGenre.count({
      where: {
        genreId: genreId?.id,
      },
    });

    try {
      // @ts-ignore
      const movies = await prisma.movie.findMany({
        where: {
          genres: {
            some: {
              genre: {
                name: genre,
              },
            },
          },
        },

        include: { genres: { include: { genre: true } } },
        take: 20,
        skip: (page - 1) * 20,
      });

      res.send({ movies, count });
    } catch (err) {
      // @ts-ignore
      res.status(400).send({ error: err.message });
    }
  },
};
