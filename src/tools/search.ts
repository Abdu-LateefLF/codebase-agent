import { tool } from "langchain";
import z from "zod";
import path from "path";
import { CODEBASE_DIR_PATH } from "../config";
import { readdir, open } from "fs/promises";
import type { MatchedLine, SearchResult } from "../types";

export async function searchFunction({
    query,
}: {
    query: string;
}): Promise<string> {
    const allFilesAndDirectories = await readdir(CODEBASE_DIR_PATH, {
        withFileTypes: true,
        recursive: true,
    });

    const allFiles = allFilesAndDirectories.filter((entry) => entry.isFile());
    const allFilePaths = allFiles.map((file) =>
        path.join(file.parentPath, file.name),
    );

    const results: SearchResult[] = [];

    for (const filePath of allFilePaths) {
        const match = await searchInFile(filePath, query);
        if (match) {
            results.push(match);
        }
    }

    return JSON.stringify(results, null, 2);
}

async function searchInFile(
    absFilePath: string,
    query: string,
): Promise<SearchResult | null> {
    const fileHandle = await open(absFilePath, "r");

    let currentLine = 1;
    let foundMatch = false;
    const matches: MatchedLine[] = [];

    for await (const line of fileHandle.readLines()) {
        if (line.toLowerCase().includes(query.toLowerCase())) {
            foundMatch = true;
            matches.push({
                lineNumber: currentLine,
                content: line,
            });
        }
        currentLine++;
    }

    await fileHandle.close();

    const relativeFilePath = path.relative(CODEBASE_DIR_PATH, absFilePath);

    if (foundMatch) {
        return {
            fileName: path.basename(absFilePath),
            filePath: relativeFilePath,
            matches,
        };
    }
    return null;
}

const searchInputSchema = z.object({
    query: z.string().describe("The search query."),
});

const searchTool = tool(searchFunction, {
    name: "search_codebase",
    description: "Searches files for a specific string in the codebase.",
    schema: searchInputSchema,
});

export default searchTool;
