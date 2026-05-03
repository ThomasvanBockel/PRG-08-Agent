import {TextLoader} from "@langchain/classic/document_loaders/fs/text"
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {AzureOpenAIEmbeddings, AzureChatOpenAI} from "@langchain/openai";
import {MemoryVectorStore} from "@langchain/classic/vectorstores/memory";
import {createAgent, tool} from "langchain";
import {CheerioWebBaseLoader} from "@langchain/community/document_loaders/web/cheerio";
import {FaissStore} from "@langchain/community/vectorstores/faiss";


const urls = [
    "https://slaythespire2.gg/characters/ironclad",
    "https://slaythespire2.gg/characters/silent",
    "https://slaythespire2.gg/characters/the-regent",
    "https://slaythespire2.gg/characters/necrobinder",
    "https://slaythespire2.gg/characters/defect",
    "https://slaythespire2.gg/cards"

]

const webDocs = []


for (const url of urls) {
    try {
        console.log(`\n[${urls.length}] Laden: ${url}`)

        const loader = new CheerioWebBaseLoader(url)
        const docs = await loader.load()

        const docWithSource = docs.map((doc) => ({
            ...doc,
            metadata: {
                ...doc.metadata,
                source: url
            }
        }));
        webDocs.push(...docWithSource)
        console.log(`geladen ${url} docs: ${docWithSource.length}`)
    } catch (e) {
        console.log(e)
    }
}


const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: 1000, chunkOverlap: 200});
const chunks = await textSplitter.splitDocuments(webDocs);

const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});

const vectorStore = await FaissStore.fromDocuments(chunks, embeddings);

await vectorStore.save("./documents");

console.log("✅ vector store saved!")


