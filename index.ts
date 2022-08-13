// #region 'Importing and configuration of Prisma'
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.send("Server Up and Running");
});

app.listen(4000, () => {
  console.log(`Server up: http://localhost:4000`);
});
// #endregion

// #region "Token, and getting user loggied in, register, validating if user is logged in"
function createToken(id: number) {
  //@ts-ignore
  const token = jwt.sign({ id: id }, process.env.MY_SECRET, {
    expiresIn: "3days",
  });

  return token;
}

async function getUserFromToken(token: string) {
  //@ts-ignore
  const data = jwt.verify(token, process.env.MY_SECRET);

  const user = await prisma.user.findUnique({
    // @ts-ignore
    where: { id: data.id },
  });

  return user;
}

app.post("/sign-up", async (req, res) => {
  const { email, password, userName } = req.body;

  try {
    const hash = bcrypt.hashSync(password);

    const user = await prisma.user.create({
      data: { email, password: hash, userName },
    });

    //@ts-ignore
    user.favMovies = [];
    res.send({ user, token: createToken(user.id) });
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
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
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/validate", async (req, res) => {
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
});
// #endregion

// #region "REST API Endpoints"

// #region "MOVIES REST API Endpoints"

app.get("/movies/page/:pagenr", async (req, res) => {
  const sortBy = req.query.sortBy;
  const ascOrDesc = req.query.ascOrDesc;

  const page = Number(req.params.pagenr);
  const nrToSkip = (page - 1) * 20;

  try {
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
});

app.get("/series/page/:pagenr", async (req, res) => {
  const sortBy = req.query.sortBy;
  const ascOrDesc = req.query.ascOrDesc;

  const page = Number(req.params.pagenr);
  const nrToSkip = (page - 1) * 20;

  try {
    const series = await prisma.serie.findMany({
      // include: { genres: { include: { genre: true } } },

      orderBy: {
        //@ts-ignore
        [sortBy]: ascOrDesc,
      },

      skip: nrToSkip,
      take: 20,
    });

    res.send(series);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/movie/:title", async (req, res) => {
  const title = req.params.title
    .split("")
    .map((char) => (char === "-" ? " " : char))
    .join("");

  try {
    const movie = await prisma.movie.findFirst({
      where: { title },
      include: { genres: { include: { genre: true } } },
    });

    res.send(movie);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/seria/:title", async (req, res) => {
  const title = req.params.title
    .split("")
    .map((char) => (char === "-" ? " " : char))
    .join("");

  try {
    const seria = await prisma.episode.findFirst({
      where: { title },
      include: { serie: true },
    });

    res.send(seria);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/latest", async (req, res) => {
  const latestMovies = await prisma.movie.findMany({
    orderBy: {
      id: "desc",
    },

    take: 20,

    include: { genres: { include: { genre: true } } },
  });

  res.send(latestMovies);
});

app.get("/movie-count", async (req, res) => {
  try {
    const count = await prisma.movie.count();
    res.send({ count });
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.delete("/genres/:id", async (req, res) => {
  const idParam = Number(req.params.id);
  // const token = req.headers.authorization;

  try {
    const genre = await prisma.genre.findUnique({
      where: { id: idParam },
    });

    if (genre) {
      await prisma.genre.delete({
        where: { id: idParam },
      });

      const genres = await prisma.genre.findMany();

      res.send({
        msg: "Event deleted succesfully",
        rows: genres,
      });
    } else {
      throw Error(
        "You are not authorized, or Event with this Id doesnt exist!"
      );
    }
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.delete("/episodes/:id", async (req, res) => {
  const idParam = Number(req.params.id);
  // const token = req.headers.authorization;

  try {
    const episode = await prisma.episode.findUnique({
      where: { id: idParam },
    });

    if (episode) {
      await prisma.episode.delete({
        where: { id: idParam },
      });

      const episodes = await prisma.episode.findMany();

      res.send({
        msg: "Event deleted succesfully",
        rows: episodes,
      });
    } else {
      throw Error(
        "You are not authorized, or Event with this Id doesnt exist!"
      );
    }
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.delete("/movies/:id", async (req, res) => {
  const idParam = Number(req.params.id);
  // const token = req.headers.authorization;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: idParam },
    });

    if (movie) {
      await prisma.movie.delete({
        where: { id: idParam },
      });

      const movies = await prisma.movie.findMany();

      res.send({
        msg: "Event deleted succesfully",
        rows: movies,
      });
    } else {
      throw Error(
        "You are not authorized, or Event with this Id doesnt exist!"
      );
    }
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.delete("/series/:id", async (req, res) => {
  const idParam = Number(req.params.id);
  // const token = req.headers.authorization;

  try {
    const serie = await prisma.serie.findUnique({
      where: { id: idParam },
    });

    if (serie) {
      await prisma.serie.delete({
        where: { id: idParam },
      });

      const series = await prisma.serie.findMany();

      res.send({
        msg: "Event deleted succesfully",
        rows: series,
      });
    } else {
      throw Error(
        "You are not authorized, or Event with this Id doesnt exist!"
      );
    }
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.patch("/series/:id", async (req, res) => {
  const { id, title, photoSrc, ratingImdb, releaseYear } = req.body;

  // const token = req.headers.authorization

  const updatedSerie = {
    id,
    title,
    photoSrc,
    ratingImdb,
    releaseYear,
  };

  try {
    const findSerie = await prisma.serie.findFirst({ where: { id } });

    if (findSerie) {
      await prisma.serie.update({ where: { id }, data: updatedSerie });
      const series = await prisma.serie.findMany();

      res.status(200).send({
        msg: "Serie deleted succesfully",
        series,
      });
    } else {
      res.status(400).send({ error: "No Serie" });
    }
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.patch("/episodes/:id", async (req, res) => {
  const { id, title, photoSrc, videoSrc, description } = req.body;

  // const token = req.headers.authorization

  const updatedEpisode = {
    id,
    title,
    photoSrc,
    videoSrc,
    description,
  };

  try {
    const findEpisode = await prisma.episode.findFirst({ where: { id } });

    if (findEpisode) {
      await prisma.serie.update({ where: { id }, data: updatedEpisode });
      const episodes = await prisma.episode.findMany();

      res.status(200).send({
        msg: "Serie deleted succesfully",
        episodes,
      });
    } else {
      res.status(400).send({ error: "No episode" });
    }
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.post("/series", async (req, res) => {
  const { title, photoSrc, ratingImdb, releaseYear } = req.body;

  // const token = req.headers.authorization

  const series = await prisma.serie.findMany();

  const createdSerie = {
    id: series.length + 1,
    title,
    photoSrc,
    ratingImdb,
    releaseYear,
  };

  try {
    //@ts-ignore
    await prisma.serie.create({ data: createdSerie });
    const series = await prisma.serie.findMany();

    res.status(200).send(series);
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.post("/episodes", async (req, res) => {
  const { title, photoSrc, videoSrc, description, serieId } = req.body;

  // const token = req.headers.authorization

  const episodes = await prisma.episode.findMany();

  const createdEpisode = {
    id: episodes.length + 1,
    title,
    photoSrc,
    videoSrc,
    description,
    serieId,
  };

  try {
    //@ts-ignore
    await prisma.episode.create({ data: createdEpisode });
    const episodes = await prisma.episode.findMany();

    res.status(200).send(episodes);
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  const idParam = Number(req.params.id);
  // const token = req.headers.authorization;

  try {
    const user = await prisma.user.findUnique({
      where: { id: idParam },
    });

    if (user) {
      await prisma.user.delete({
        where: { id: idParam },
      });

      const users = await prisma.user.findMany();

      res.send({
        msg: "Event deleted succesfully",
        rows: users,
      });
    } else {
      throw Error(
        "You are not authorized, or Event with this Id doesnt exist!"
      );
    }
  } catch (err) {
    //@ts-ignore
    res.status(400).send({ error: err.message });
  }
});
// #endregion

app.get("/series-count", async (req, res) => {
  try {
    const count = await prisma.serie.count();
    res.send({ count });
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.post("/search", async (req, res) => {
  const { title, page } = req.body;

  try {
    const movies = await prisma.movie.findMany({
      where: {
        title: { contains: title },
      },
      include: { genres: { include: { genre: true } } },
      skip: (page - 1) * 20,
      take: 20,
    });

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
});

// #endregion

// #region "OTHER REST API Endpoints"

app.get("/favorites", async (req, res) => {
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
});

app.post("/favorites", async (req, res) => {
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
});

app.get("/genres", async (req, res) => {
  try {
    const genres = await prisma.genre.findMany();
    res.send(genres);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.send(users);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    res.send(movies);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/series", async (req, res) => {
  try {
    const series = await prisma.serie.findMany();
    res.send(series);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/episodes", async (req, res) => {
  try {
    const episodes = await prisma.episode.findMany();
    res.send(episodes);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/genres/:genre", async (req, res) => {
  const genre = req.params.genre;
  const page = Number(req.query.page);

  const genreId = await prisma.genre.findFirst({
    where: { name: genre },
  });

  const count = await prisma.movieGenre.count({
    where: {
      genreId: genreId?.id,
    },
  });

  try {
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
});

app.get("/seriesNoPagination/:id", async (req, res) => {
  const serieId = Number(req.params.id);

  const serie = await prisma.serie.findFirst({
    where: { id: serieId },
    include: { episodes: true },
  });

  try {
    res.send(serie);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/episodesNoPagination/:id", async (req, res) => {
  const episodeId = Number(req.params.id);

  const episode = await prisma.episode.findFirst({
    where: { id: episodeId },
    include: { serie: true },
  });

  try {
    res.send(episode);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/genresNoPagination/:id", async (req, res) => {
  const genreId = Number(req.params.id);

  const genre = await prisma.genre.findFirst({
    where: { id: genreId },
    include: { movies: true },
  });

  try {
    res.send(genre);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/moviesNoPagination/:id", async (req, res) => {
  const movieId = Number(req.params.id);
  const movie = await prisma.movie.findFirst({
    where: { id: movieId },
    include: { genres: { include: { genre: true } } },
  });

  try {
    res.send(movie);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/usersNoPagination/:id", async (req, res) => {
  const userId = Number(req.params.id);

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  try {
    res.send(user);
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/series/:serie", async (req, res) => {
  const serie = req.params.serie;
  let page = Number(req.query.page);

  try {
    const serial = await prisma.serie.findFirst({
      where: { title: serie },
      // @ts-ignore
      include: { episodes: true },
      take: 20,
      skip: (page - 1) * 20,
    });
    res.send({ serial });
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.get("/genresAll/:genre", async (req, res) => {
  const genre = req.params.genre;

  const genreId = await prisma.genre.findFirst({
    where: { name: genre },
  });

  const count = await prisma.movieGenre.count({
    where: {
      genreId: genreId?.id,
    },
  });

  try {
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
    });

    res.send({ movies, count });
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});
// #endregion

// #endregion

// #region "Non Used functions"
// app.get("/single-movie", async (req, res) => {
//   const resq = await fetch("https://www.filma24.ch/post-sitemap9.xml");

//   const htmlText = await resq.text();
//   const parser = new XMLParser();

//   let jObj = parser.parse(htmlText);
//   const entries = jObj.urlset.url; //array of each entry that contains loc,image

//   const movies: any = [];

//   for (const entry of entries) {

//     const singleMovie = await fetch(entry.loc);
//     const singleMovieText = await singleMovie.text();
//     const singleMovieHtml = parse(singleMovieText);

//     const movieLink = singleMovieHtml.querySelector(
//       "div.player div.movie-player p iframe"
//     )?.attributes.src;

//     const movieTitle = singleMovieHtml.querySelector(
//       ".movie-info .main-info .title h2"
//     )?.innerText;

//     const trailerLink = singleMovieHtml.querySelector(".trailer-player iframe")
//       ?.attributes.src;

//     const genreLis = singleMovieHtml.querySelectorAll(
//       ".secondary-info .info-left .genre li"
//     );

//     const genres: any = [];

//     genreLis.forEach((li) => genres.push(li.innerText));

//     const movieLength = singleMovieHtml.querySelector(
//       ".info-right span.movie-len"
//     )?.innerText;

//     const releaseYear = singleMovieHtml.querySelector(
//       ".info-right span.quality"
//     )?.innerText;

//     const imdbRating = singleMovieHtml.querySelector(
//       ".info-right span:last-child a"
//     )?.innerText;

//     const synopsis = singleMovieHtml.querySelector(
//       ".synopsis .syn-wrapper p"
//     )?.innerText;

//     const file = fs.createWriteStream(
//       `images/${entry["image:image"]["image:loc"].split("/").pop()}`
//     );

//     const request = https.get(
//       entry["image:image"]["image:loc"].replace("http", "https"),

//       function (response) {
//         response.pipe(file);
//       }
//     );

//     const thumbnail = entry["image:image"]["image:loc"];

//     movies.push({
//       title: movieTitle,
//       videoSrc: movieLink,
//       genres,
//       trailerSrc: trailerLink,
//       duration: movieLength,
//       releaseYear,
//       ratingImdb: imdbRating,
//       description: synopsis,
//       photoSrc: thumbnail,
//     });
//   }

//   res.send(movies);
// });

// async function addLatestMovies() {
//   const resq = await fetch("https://www.filma24.ch/feed/", {
//     headers: {
//       "User-Agent":
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
//     },
//   });

//   const text = await resq.text();

//   const parser = new XMLParser();
//   let jObj = parser.parse(text);

//   const moviesToFetch: any = [];

//   for (const item of jObj.rss.channel.item) {
//     const foundMovie = await prisma.movie.findFirst({
//       where: {
//         title: item.title,
//       },
//     });

//     if (foundMovie === null) {
//       moviesToFetch.push(item);
//     }
//   }

//   const movies: any = [];

//   for (const movie of moviesToFetch) {
//     const singleMovie = await fetch(movie.link);
//     const singleMovieText = await singleMovie.text();
//     const singleMovieHtml = parse(singleMovieText);

//     const movieLink = singleMovieHtml.querySelector(
//       "div.player div.movie-player p iframe"
//     )?.attributes.src;

//     const movieTitle = singleMovieHtml.querySelector(
//       ".movie-info .main-info .title h2"
//     )?.innerText;

//     const trailerLink = singleMovieHtml.querySelector(".trailer-player iframe")
//       ?.attributes.src;

//     const genreLis = singleMovieHtml.querySelectorAll(
//       ".secondary-info .info-left .genre li"
//     );

//     const genres: any = [];

//     genreLis.forEach((li) => genres.push(li.innerText));

//     const movieLength = singleMovieHtml.querySelector(
//       ".info-right span.movie-len"
//     )?.innerText;

//     const releaseYear = singleMovieHtml.querySelector(
//       ".info-right span.quality"
//     )?.innerText;

//     const imdbRating = singleMovieHtml.querySelector(
//       ".info-right span:last-child a"
//     )?.innerText;

//     const synopsis = singleMovieHtml.querySelector(
//       ".synopsis .syn-wrapper p"
//     )?.innerText;

//     const thumbnai = singleMovieHtml.querySelector(`meta[property="og:image"]`)
//       ?.attributes.content;

//     const thumbnail = thumbnai?.includes("https")
//       ? thumbnai
//       : thumbnai?.replace("http", "https").replace(".so", ".sh");

//     const file = fs.createWriteStream(
//       //@ts-ignore
//       `public/images/${thumbnail?.split("/").pop()}`
//     );

//     const request = https.get(
//       //@ts-ignore
//       thumbnail,

//       function (response) {
//         response.pipe(file);
//       }
//     );

//     movies.push({
//       title: movieTitle,
//       videoSrc: movieLink,
//       genres,
//       trailerSrc: trailerLink,
//       duration: movieLength,
//       releaseYear,
//       ratingImdb: imdbRating,
//       description: synopsis,
//       photoSrc: `http://localhost:4000/images/${thumbnail?.split("/").pop()}`,
//     });
//   }

//   if (movies.length !== 0) {

//     movies.forEach(
//       //@ts-ignore
//       (movie) => (movie.ratingImdb = Number(movie.ratingImdb))
//     );

//     //@ts-ignore
//     movies.forEach(
//       //@ts-ignore
//       (movie) => (movie.releaseYear = Number(movie.releaseYear))
//     );

//     movies.forEach(async function (movie) {
//       const genresa = [];

//       for (let genre of movie.genres) {
//         const genreId = genre.find((genre1) => genre1.name === genre);

//         if (genreId) {
//           const id = genre.findIndex((genre) => genre.name === genreId?.name);

//           //@ts-ignore
//           genresa.push(id + 1);
//         } else {
//           const newGenre = await prisma.genre.create({
//             data: {
//               name: genre,
//             },
//           });

//           //@ts-ignore
//           genresa.push(newGenre.id);
//         }
//       }

//       //@ts-ignore
//       movie.genres = genresa;
//     });

//     for (const movie of movies) {
//       const createdMovie = await prisma.movie.create({
//         //@ts-ignore
//         data: {
//           description: movie.description,
//           duration: movie.duration,
//           photoSrc: movie.photoSrc,
//           //@ts-ignore
//           ratingImdb: movie.ratingImdb,
//           //@ts-ignore
//           releaseYear: movie.releaseYear,
//           title: movie.title,
//           videoSrc: movie.videoSrc,
//           trailerSrc: movie.trailerSrc,
//         },
//       });

//       for (const genre of movie.genres) {
//         await prisma.movieGenre.create({
//           data: { genreId: genre, movieId: createdMovie.id },
//         });
//       }
//     }
//   }
// }
// #endregion
