import {createAgent, tool} from "langchain";
import {FaissStore} from "@langchain/community/vectorstores/faiss";
import {AzureOpenAIEmbeddings} from "@langchain/openai";

const embeddings = new AzureOpenAIEmbeddings({
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});

const vectorStore = await FaissStore.load("./documents", embeddings);

export const getCharacter = tool(
    async ({character}) => {
        console.log(`🔧 the character is ${character}`)
        const releventDocuments = await vectorStore.similaritySearch(character, 10)
        const context = releventDocuments.map((doc) => doc.pageContent).join('\n\n')
        // console.log("--------- CONTEXT ----------")
        // console.log(context)
        return context
    },
    {
        name: "get_character",
        description: "get information about an character from slay the spire",
        schema: {
            type: "object",
            properties: {
                character: {type: "string"}
            },
            required: ["character"]
        },
    },
);

export const getCard = tool(
    async ({card}) => {
        console.log(`🔧 the card is ${card}`)
        const releventDocuments = await vectorStore.similaritySearch(card, 10)
        const context = releventDocuments.map((doc) => doc.pageContent).join('\n\n')
        // console.log("--------- CONTEXT ----------")
        // console.log(context)
        return context
    },
    {
        name: "get_card",
        description: "get information about an card from slay the spire",
        schema: {
            type: "object",
            properties: {
                card: {type: "string"}
            },
            required: ["card"]
        },
    },
);

export const getPlayTime = tool(
    async ({playtime}) => {
        console.log("🔧 playing time tool")
        const res = await fetch(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.MY_STEAM_KEY}&steamid=76561198815904737`)


        const data = await res.json();
        console.log("Slay the Spire 2 Stats:", data);

        return data;
    },
    {
        name: "get_play_time",
        description: "get play time information about a player for slay the spire 2 you dont need a steamId or a username",
        schema: {
            type: "object",
            properties: {playtime: {type: "string"}},
        },
    },
);

