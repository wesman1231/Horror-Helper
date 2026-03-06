import { removeStopWords } from "../controller/searchUtils/removeStopWords.ts";

describe('Formats search queries passed via url query string to use boolean mode in a full text index search', () => {
    test('"The+Evil+Dead" should return: "+Evil +Dead*"', () => {
        const result = removeStopWords('The+Evil+Dead');
        expect(result).toBe('+Evil* +Dead*');
    });
});