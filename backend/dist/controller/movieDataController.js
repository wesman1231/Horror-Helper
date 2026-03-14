import { db } from '../db/pool.js';
/**
 * Fetches movie details by TMDB ID from the database.
 */
export async function fetchMovieInfo(req, res) {
    try {
        const movieId = Number(req.params.id);
        // Executing the query
        const [rows] = await db.execute('SELECT * FROM movies WHERE tmdbid = ?', [movieId]);
        // Check if the result set is empty
        if (!rows || rows.length === 0) {
            res.status(404).json({ error: '404 Movie/Show could not be found' });
            return;
        }
        // Send the movie data
        res.status(200).json(rows[0]);
    }
    catch (error) {
        console.error('Error fetching movie info:', error);
        res.status(500).json({ error: 'Internal server error', req });
    }
}
;
export async function fetchFranchiseInfo(req, res) {
    const franchiseName = String(req.params.franchiseName).replaceAll('+', ' ');
    try {
        //query database to get all movies in a franchise
        const [fetchMoviesFromDB] = await db.execute(`SELECT * FROM movies WHERE franchise = ? ORDER BY releasedate `, [franchiseName]);
        //if franchise cannot be found, return 404 error
        if (fetchMoviesFromDB === null || fetchMoviesFromDB.length === 0) {
            return res.status(404).json({ error: "Franchise does not exist" });
        }
        //if no errors, return movies
        return res.status(200).json({ movies: fetchMoviesFromDB });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
}
export async function fetchNewReleases(req, res) {
    const currentDate = new Date();
    const stringCurrentYear = String(currentDate.getFullYear());
    const elementsPerPage = '10';
    const pageNumber = Number(req.query.page);
    const calculateOffset = pageNumber * Number(elementsPerPage);
    const offset = String(calculateOffset);
    await queryDB();
    async function queryDB() {
        try {
            const [numberOfResults] = await db.execute(`SELECT COUNT(*) AS total FROM movies WHERE releasedate LIKE ? AND releasedate <= CURDATE();`, [`%${stringCurrentYear}%`]);
            const numberOfPages = Math.ceil(numberOfResults[0].total / Number(elementsPerPage));
            const [newMovies] = await db.execute('SELECT * FROM movies WHERE releasedate LIKE ? AND releasedate <= CURDATE() ORDER BY releasedate DESC LIMIT ? OFFSET ?', [`%${stringCurrentYear}%`, elementsPerPage, offset]);
            return res.status(200).json({ newReleases: newMovies, numberOfPages: numberOfPages });
        }
        catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
