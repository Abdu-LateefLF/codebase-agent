import agent from "./agent";
import readline from "readline/promises";
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";
import "dotenv/config";

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log("Welcome to the Codebase Agent! Type 'exit' to quit.");

    const tracer = new LangChainTracer();

    while (true) {
        const userInput = await rl.question("You: ");
        if (userInput.toLowerCase() === "exit") {
            console.log("Goodbye!");
            break;
        }

        try {
            const response = await agent.invoke(
                {
                    messages: [{ role: "user", content: userInput }],
                },
                {
                    recursionLimit: 50,
                    configurable: { thread_id: "1" },
                    callbacks: [
                        tracer,
                        {
                            handleToolStart(
                                tool,
                                input,
                                runId,
                                parentRunId,
                                tags,
                                metadata,
                                runName,
                                toolCallId,
                            ) {
                                console.log(
                                    `TOOL ${runName} run with input ${input}`,
                                );
                            },
                        },
                    ],
                },
            );

            console.log(response.structuredResponse, { depth: null });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    rl.close();
}

function handleExit() {
    console.log("\nGoodbye!");
    process.exit(0);
}

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
