import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { options } from './utils/swagger';
import movieRoutes from './routes/movie.routes';
import episodeRoutes from './routes/episode.routes';
import genreRoutes from './routes/genre.routes';
import serieRoutes from './routes/serie.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import { XMLParser } from 'fast-xml-parser';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { Movie } from './models/movie.model';
import https from 'https';
import fs from 'fs';
import 'dotenv/config';
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

export const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

const specs = swaggerJsDoc(options);
export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.send('Server Up and Running');
});
app.listen(4000, () => {
    console.log(`Server up: http://localhost:4000`);
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(authRoutes);
app.use(movieRoutes);
app.use(serieRoutes);
app.use(genreRoutes);
app.use(episodeRoutes);
app.use(userRoutes);

app.get('/filma24-new', async (req, res) => {
    const resq = await fetch('https://www.filma24.so/feed', {
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
    console.log(jObj.rss.channel.item);

    //@ts-ignore
    // res.send(html);
    res.send('ok');
});

app.get('/single-movie.model', async (req, res) => {
    const resq = await fetch('https://www.filma24.so/post-sitemap9.xml');
    const htmlText = await resq.text();
    const parser = new XMLParser();
    let jObj = parser.parse(htmlText);
    const entries = jObj.urlset.url; //array of each entry that contains loc,image
    const movies: Movie[] = [];

    for (const entry of entries) {
        const singleMovie = await fetch(entry.loc);
        const singleMovieText = await singleMovie.text();
        const singleMovieHtml = parse(singleMovieText);
        const movieLink = singleMovieHtml.querySelector('div.player div.movie-player p iframe')?.attributes.src;
        const movieTitle = singleMovieHtml.querySelector('.movie-info .main-info .title h2')?.innerText;
        const trailerLink = singleMovieHtml.querySelector('.trailer-player iframe')?.attributes.src;
        const genreLis = singleMovieHtml.querySelectorAll('.secondary-info .info-left .genre li');

        const genres: any = [];
        genreLis.forEach((li) => genres.push(li.innerText));

        const movieLength = singleMovieHtml.querySelector('.info-right span.movie-len')?.innerText;
        const releaseYear = singleMovieHtml.querySelector('.info-right span.quality')?.innerText;
        const imdbRating = singleMovieHtml.querySelector('.info-right span:last-child a')?.innerText;
        const synopsis = singleMovieHtml.querySelector('.synopsis .syn-wrapper p')?.innerText;
        const file = fs.createWriteStream(`images/${entry['image:image']['image:loc'].split('/').pop()}`);

        const request = https.get(
            entry['image:image']['image:loc'].replace('http', 'https'),

            function (response) {
                response.pipe(file);
            },
        );

        const thumbnail = entry['image:image']['image:loc'];

        movies.push({
            title: movieTitle!,
            videoSrc: movieLink!,
            genres,
            trailerSrc: trailerLink!,
            duration: movieLength!,
            releaseYear: Number(releaseYear)!,
            ratingImdb: Number(imdbRating)!,
            description: synopsis!,
            photoSrc: thumbnail!,
            views: 0,
        });
    }

    res.send(movies);
});
