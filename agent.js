import {AzureChatOpenAI} from "@langchain/openai"
import {createAgent, tool} from "langchain";
import {MemorySaver} from "@langchain/langgraph";
import {getCharacter, getCard, getPlayTime} from "./tools.js"
import * as z from "zod";

const model = new AzureChatOpenAI({temperature: 0.2});
const checkpointer = new MemorySaver();


const myToolResponse = z.object({
    message: z.string().describe("The message to the user"),
    toolsUsed: z.array(z.string()).describe("List with names of tools used in the response, without the word function and without extract"),
    source: z.array(z.string()).describe("list with links of sources where the message came from.")
});

const agent = createAgent({
    model,
    tools: [getCharacter, getCard, getPlayTime],
    checkpointer,
    responseFormat: myToolResponse,
    systemPrompt: "You are a formal assistent for the game Slay the Spire 2. only mention slay the spire or slay the spire 2, no other game. only use a tool when it is needed. always use real markdown. You can use the get_character tool to get info on an character from slay the spire. You can use the get_card tool to get info about a card,you can use the get_play_time tool to find information about the playing time from slay the spire 2 for the player get_achievements does NOT require steam id or username",
});


export async function callAgent(prompt) {
    try {
        const result = await agent.invoke({
                messages: [{role: "user", content: prompt}],
            },
            {configurable: {thread_id: "1"}});

        console.log('source: ', result.structuredResponse.source)
        console.log('tools: ', result.structuredResponse.toolsUsed)
        return {
            response: result.structuredResponse.message,
            tool: result.structuredResponse.toolsUsed,
            source: result.structuredResponse.source
        };

    } catch (error) {
        console.error("Azure OpenAI error:", error);
        return "Sorry, the assistant is currently unavailable.";
    }
}


