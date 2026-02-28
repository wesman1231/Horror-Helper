import express from 'express';
import type { Request, Response } from 'express';
import { db } from '../db/pool.ts'; 
import type { RowDataPacket } from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/getDirectors', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT DISTINCT director FROM movies'
    );

    for (const row of rows) {
      const directorName: string = row.director;

      if (!directorName) continue;

      const response = await fetch(
        `https://api.themoviedb.org/3/search/person?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(directorName)}`
      );

      const data = await response.json();

      if (!data.results) continue;

      for (const person of data.results) {
        if (person.known_for_department === 'Directing') {
          await db.execute(
            `INSERT INTO directorinfo (tmdbid, name, profilepath)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE
             profilepath = VALUES(profilepath)`,
            [person.id, person.name, person.profile_path]
          );
        }
      }
    }

    res.json({ message: 'Directors synced successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;