import { XMLParser } from 'fast-xml-parser';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { prisma } from '../app';
import { Genre } from '../models/genre.model';
import { Movie } from '../models/movie.model';
import https from 'https';
import fs from 'fs';

async function addLatestMovies() {
    const resq = await fetch('https://www.filma24.sh/feed/', {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
        },
    });

    const text = await resq.text();
    // const html = cheerio.load(text)
    // const html = jquery.parseHTML(text)
    // console.log(text);

    const parser = new XMLParser();
    let jObj = parser.parse(text);

    const moviesToFetch: any = [];

    for (const item of jObj.rss.channel.item) {
        const foundMovie = await prisma.movie.findFirst({
            where: {
                title: item.title,
            },
        });

        if (foundMovie === null) {
            moviesToFetch.push(item);
        }
    }

    const movies: Movie[] = [];

    for (const movie of moviesToFetch) {
        const singleMovie = await fetch(movie.link);
        const singleMovieText = await singleMovie.text();
        const singleMovieHtml = parse(singleMovieText);

        const movieLink = singleMovieHtml.querySelector('div.player div.movie-player p iframe')?.attributes.src;
        const movieTitle = singleMovieHtml.querySelector('.movie-info .main-info .title h2')?.innerText;
        const trailerLink = singleMovieHtml.querySelector('.trailer-player iframe')?.attributes.src;
        const genreLis = singleMovieHtml.querySelectorAll('.secondary-info .info-left .genre li');

        const genres: any[] = [];
        genreLis.forEach((li) => genres.push(li.innerText));

        const movieLength = singleMovieHtml.querySelector('.info-right span.movie-len')?.innerText;
        const releaseYear = singleMovieHtml.querySelector('.info-right span.quality')?.innerText;
        const imdbRating = singleMovieHtml.querySelector('.info-right span:last-child a')?.innerText;
        const synopsis = singleMovieHtml.querySelector('.synopsis .syn-wrapper p')?.innerText;
        const thumbnai = singleMovieHtml.querySelector(`meta[property="og:image"]`)?.attributes.content;
        const thumbnail = thumbnai?.includes('https')
            ? thumbnai
            : thumbnai?.replace('http', 'https').replace('.so', '.sh');
        const file = fs.createWriteStream(`public/images/${thumbnail?.split('/').pop()}`);
        const request = https.get(thumbnail!, function (response) {
            response.pipe(file);
        });

        movies.push({
            title: movieTitle!,
            videoSrc: movieLink!,
            genres,
            trailerSrc: trailerLink!,
            duration: movieLength!,
            releaseYear: Number(releaseYear)!,
            ratingImdb: Number(imdbRating)!,
            description: synopsis!,
            photoSrc: `http://localhost:4000/images/${thumbnail?.split('/').pop()}`,
            views: 0,
        });
    }

    // if (movies.length !== 0) {
    //     movies.forEach((movie) => (movie.ratingImdb = Number(movie.ratingImdb)));
    //     movies.forEach((movie) => (movie.releaseYear = Number(movie.releaseYear)));
    //     movies.forEach(async function (movie) {
    //         const genresa = [];

    //         for (let genre of movie.genres!) {
    //             const genreId = genres.find((genre1) => genre1.name === genre);

    //             if (genreId) {
    //                 const id = genres.findIndex((genre) => genre.name === genreId?.name);
    //                 genresa.push(id + 1);
    //             } else {
    //                 const newGenre = await prisma.genre.create({
    //                     data: {
    //                         name: genre,
    //                     },
    //                 });

    //                 genresa.push(newGenre.id);
    //             }
    //         }

    //         movie.genres = genresa;
    //     });

    //     for (const movie of movies) {
    //         const createdMovie = await prisma.movie.create({
    //             data: {
    //                 description: movie.description,
    //                 duration: movie.duration,
    //                 photoSrc: movie.photoSrc,
    //                 ratingImdb: movie.ratingImdb,
    //                 releaseYear: movie.releaseYear,
    //                 title: movie.title,
    //                 videoSrc: movie.videoSrc,
    //                 trailerSrc: movie.trailerSrc,
    //             },
    //         });

    //         for (const genre of movie.genres!) {
    //             await prisma.movieGenre.create({
    //                 data: { genreId: genre, movieId: createdMovie.id },
    //             });
    //         }
    //     }
    // }
}
