import { tool } from "langchain";
import z from "zod";
import { readFile } from "node:fs/promises";
import path from "path";
import { CODEBASE_DIR_PATH } from "../config";

export async function readFileFunction({
    filePath,
}: {
    filePath: string;
}): Promise<string> {
    const completePath = path.join(CODEBASE_DIR_PATH, filePath);

    try {
        const fileContent = await readFile(completePath, "utf-8");
        return fileContent;
    } catch (error) {
        throw new Error(
            `Error reading file: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
}

const readFileInputSchema = z.object({
    filePath: z.string().describe("The relative path of the file to read."),
});

const readFileTool = tool(readFileFunction, {
    name: "read_file",
    description: "Read the content of a file in the codebase.",
    schema: readFileInputSchema,
});

export default readFileTool;
