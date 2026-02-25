import { resolveBackendPath, readCsvAsRecords, writeJson } from './utils';

interface MovieEntry {
  title: string;
  genres: string;
  imdbId?: string;
  tmdbId?: string;
}

function main(): void {
  const moviesPath = process.env.MOVIES_CSV ?? resolveBackendPath('data/movies.csv');
  const linksPath = process.env.LINKS_CSV ?? resolveBackendPath('data/links.csv');
  const outputPath = process.env.MOVIES_JSON ?? resolveBackendPath('data/generated/movies.json');

  const movieRows = readCsvAsRecords(moviesPath);
  const linkRows = readCsvAsRecords(linksPath);

  const movies: Record<string, MovieEntry> = {};

  for (const row of movieRows) {
    movies[row.movieId] = {
      title: row.title,
      genres: row.genres
    };
  }

  for (const row of linkRows) {
    const movie = movies[row.movieId];
    if (!movie) {
      continue;
    }

    movie.imdbId = row.imdbId;
    movie.tmdbId = row.tmdbId;
  }

  writeJson(outputPath, movies);
  console.log(`movies.json gerado com ${Object.keys(movies).length} filmes em: ${outputPath}`);
}

main();
