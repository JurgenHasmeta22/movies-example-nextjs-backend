import { prisma } from "@prisma/client";

export const moviesController = {
  allMoviesGet: async (req: any, res: any) => {
    const sortBy = req.query.sortBy;
    const ascOrDesc = req.query.ascOrDesc;

    const page = Number(req.params.pagenr);
    const nrToSkip = (page - 1) * 20;

    try {
      // @ts-ignore
      const movies = await prisma.movie.findMany({
        include: { genres: { include: { genre: true } } },

        orderBy: {
          //@ts-ignore
          [sortBy]: ascOrDesc,
        },

        skip: nrToSkip,
        take: 20,
      });

      res.send(movies);
    } catch (err) {
      // @ts-ignore
      res.status(400).send({ error: err.message });
    }
  },

  singleMovieGet: async (req: any, res: any) => {
    const title = req.params.title
      .split("")
      .map((char) => (char === "-" ? " " : char))
      .join("");

    try {
      // @ts-ignore
      const movie = await prisma.movie.findFirst({
        where: { title },
        include: { genres: { include: { genre: true } } },
      });

      res.send(movie);
    } catch (err) {
      // @ts-ignore
      res.status(400).send({ error: err.message });
    }
  },

  latestMoviesGet: async (req: any, res: any) => {
    // @ts-ignore
    const latestMovies = await prisma.movie.findMany({
      orderBy: {
        id: "desc",
      },

      take: 20,

      include: { genres: { include: { genre: true } } },
    });

    res.send(latestMovies);
  },

  moviesCount: async (req: any, res: any) => {
    try {
      // @ts-ignore
      const count = await prisma.movie.count();
      res.send({ count });
    } catch (err) {
      // @ts-ignore
      res.status(400).send({ error: err.message });
    }
  },

  moviesSearch: async (req: any, res: any) => {
    const { title, page } = req.body;

    try {
      // @ts-ignore
      const movies = await prisma.movie.findMany({
        where: {
          title: { contains: title },
        },
        include: { genres: { include: { genre: true } } },
        skip: (page - 1) * 20,
        take: 20,
      });

      // @ts-ignore
      const count = await prisma.movie.count({
        where: {
          title: { contains: title },
        },
      });

      res.send({ movies, count });
    } catch (err) {
      // @ts-ignore
      res.status(400).send({ error: err.message });
    }
  },
};
