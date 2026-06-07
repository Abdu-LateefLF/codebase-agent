import agent from "./agent";
import readline from "readline/promises";

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log("Welcome to the Codebase Agent! Type 'exit' to quit.");

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
                    callbacks: [
                        {
                            handleToolStart(tool, input) {
                                console.log(
                                    `Tool "${tool.name}" started with input:`,
                                    input,
                                );
                            },
                        },
                    ],
                },
            );

            console.dir(response, { depth: null });
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
