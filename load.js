import {AzureOpenAIEmbeddings, AzureChatOpenAI} from "@langchain/openai";
import {FaissStore} from "@langchain/community/vectorstores/faiss";


const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});

const vectorStore = await FaissStore.load("./documents", embeddings);
// console.log("✅ vector store loaded!")


const result = await vectorStore.similaritySearch("is water wet?", 4);
console.log(result);

