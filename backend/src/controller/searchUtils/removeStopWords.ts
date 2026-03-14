/**
     * Removes stop words and formats title input
     * for MySQL BOOLEAN MODE full-text search.
     *
     * - Removes common filler words
     * - Prefixes each word with "+" for boolean mode strict matching
     * - Appends "*" for prefix matching
     */
export function removeStopWords(title: string){
        if(title !== ''){
            const formatTitleQuery = title.replaceAll('+', ' ');
            const stopWords = ['a','about','an','are','as','at','be','by','com','de','en','for','from','how','i','in','is','it','la','of','on','or','that','the','this','to','und','was','what','when','where','who','will','with','www'];
            const split = formatTitleQuery.split(' ');
            const removeStopWords = split.filter(word => !stopWords.includes(word.toLowerCase()));
            const finalTitleQueryArray: string[] = [];
            
            for(let i = 0; i < removeStopWords.length; i++){
                const split = removeStopWords[i]!.split('');
                split.unshift('+');
                split.push('*');
                const join = split.join('');
                finalTitleQueryArray.push(join);
            }
            const finalTitleQuery = finalTitleQueryArray.join(' ');
            return finalTitleQuery;
        }
        
        return '';
}