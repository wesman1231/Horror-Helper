export function checkSortModeAndMediaType(mediaType, sortMode) {
    if (mediaType === 'movies') {
        let validSortModes = new Set(['relevance', 'releasedate', 'newest', 'title', 'director', 'franchise']);
        if (validSortModes.has(sortMode)) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (mediaType === 'shows') {
        let validSortModes = new Set(['relevance', 'firstairdate', 'lastairdate', 'title', 'creator']);
        if (validSortModes.has(sortMode)) {
            return true;
        }
        else {
            return false;
        }
    }
    return false;
}
