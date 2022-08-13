import { prisma } from "@prisma/client";

export const authenticationController = {
  register: async (req: any, res: any) => {
    const { email, password, userName } = req.body;

    try {
      const hash = bcrypt.hashSync(password);

      const user = await prisma.user.create({
        data: { email: email, password: hash, userName: userName },
      });

      //@ts-ignore
      user.favMovies = [];
      res.send({ user, token: createToken(user.id) });
    } catch (err) {
      // @ts-ignore
      res.status(400).send({ error: err.message });
    }
  },

  login: async (req: any, res: any) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // @ts-ignore
    const passwordMatches = bcrypt.compareSync(password, user.password);

    if (user && passwordMatches) {
      const favorites = await prisma.favorite.findMany({
        where: { userId: user?.id },
      });

      //@ts-ignore
      user.favMovies = await prisma.movie.findMany({
        where: { id: { in: favorites.map((f) => f.movieId) } },
        include: { genres: { include: { genre: true } } },
      });

      res.send({ user, token: createToken(user.id) });
    } else {
      throw Error("Boom");
    }
  },

  validate: async (req: any, res: any) => {
    const token = req.headers.authorization || "";

    try {
      const user = await getUserFromToken(token);

      //favourite movies
      const favorites = await prisma.favorite.findMany({
        where: { userId: user?.id },
      });

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
