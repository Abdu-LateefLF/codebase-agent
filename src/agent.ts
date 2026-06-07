import { createAgent, modelRetryMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import listFilesTool from "./tools/listFiles";
import readFileTool from "./tools/readFile";
import searchTool from "./tools/search";
import { SYSTEM_PROMPT } from "./prompts";
import z from "zod";
import "dotenv/config";

if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set");
}

const model = new ChatGoogleGenerativeAI({
    model: "gemma-4-26b-a4b-it",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0,
    topP: 0.6,
    maxOutputTokens: 2000,
});

const responseSchema = z.object({
    answer: z.string(),
    confidence: z.number().min(1).max(10),
    filesConsulted: z.array(z.string()).min(0),
});

const agent = createAgent({
    systemPrompt: SYSTEM_PROMPT,
    model: model,
    tools: [listFilesTool, readFileTool, searchTool],
    responseFormat: responseSchema,
});

export default agent;
