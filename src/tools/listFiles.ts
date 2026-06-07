import { tool } from "langchain";
import { readdir } from "node:fs/promises";
import path from "path";
import z from "zod";
import { CODEBASE_DIR_PATH } from "../config";

export async function listFilesFunction(): Promise<string> {
    const files = await readdir(CODEBASE_DIR_PATH, {
        withFileTypes: true,
        recursive: true,
    });
    const filesWithPath = files
        .filter((file) => file.isFile())
        .map((file) => {
            const completePath = path.join(file.parentPath, file.name);
            return path.relative(CODEBASE_DIR_PATH, completePath);
        });

    return filesWithPath.join("\n");
}

const listFilesInputSchema = z.object({});

const listFiles = tool(listFilesFunction, {
    name: "list_files",
    description: "List all files in the codebase.",
    schema: listFilesInputSchema,
});

export default listFiles;
