export interface MatchedLine {
    lineNumber: number;
    content: string;
}

export interface SearchResult {
    fileName: string;
    filePath: string;
    matches: MatchedLine[];
}
