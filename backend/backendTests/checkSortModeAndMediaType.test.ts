import { checkSortModeAndMediaType } from "../controller/searchUtils/checkSortModeAndMediaType.ts";

describe('verifies sort mode and media type to prevent sql injection', () => {
    //valid media types: 'movies', 'shows'
    test('If mediaType !== movies or shows, return false', () => {
        const result = checkSortModeAndMediaType('invalid media type', 'relevance');
        expect(result).toBe(false);
    });

    //valid sort modes: 'relevance', 'releasedate', 'newest', 'title', 'director', 'franchise', 'firstairdate', 'lastairdate', 'creator'
    test('If sortMode is not in validSortModes, return false', () => {
        const result = checkSortModeAndMediaType('movies', 'invalid sort mode');
        expect(result).toBe(false);
    });

    test('If mediaType and sortMode are both valid, return true', () => {
        const result = checkSortModeAndMediaType('movies', 'relevance');
        expect(result).toBe(true);
    });
});