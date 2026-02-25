import { existsSync, readFileSync } from 'node:fs';
import { resolveBackendPath, readCsvAsRecords, writeJson } from './utils';

interface UsersMap {
  [userId: string]: {
    [movieId: string]: number;
  };
}

function main(): void {
  const ratingsPath = process.env.RATINGS_CSV ?? resolveBackendPath('data/ratings.csv');
  const legacyUsersPath = resolveBackendPath('users.json');
  const outputPath = process.env.USERS_JSON ?? resolveBackendPath('data/generated/users.json');

  const users: UsersMap = {};
  if (!existsSync(ratingsPath) && existsSync(legacyUsersPath)) {
    const legacyUsers = JSON.parse(readFileSync(legacyUsersPath, 'utf8')) as UsersMap;
    writeJson(outputPath, legacyUsers);
    console.log(
      `ratings.csv ausente, usando users.json legado. Total de usuarios: ${Object.keys(legacyUsers).length}`
    );
    return;
  }

  const rows = readCsvAsRecords(ratingsPath);

  for (const row of rows) {
    const userId = row.userId;
    const movieId = row.movieId;
    const rating = Number(row.rating);

    if (!users[userId]) {
      users[userId] = {};
    }
    users[userId][movieId] = rating;
  }

  writeJson(outputPath, users);
  console.log(`users.json gerado com ${Object.keys(users).length} usuarios em: ${outputPath}`);
}

main();
