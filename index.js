const { ChatOllama } = require("@langchain/ollama");
const { OllamaEmbeddings } = require("@langchain/community/embeddings/ollama");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const csvToJson = require('convert-csv-to-json');
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

(async function() {
    // Hello word example connecting to local llama3.1 chat prompt
    // const model = new ChatOllama({
    //     model: "llama3.1",  // Default value.
    //     baseUrl: 'http://127.0.0.1:11434'
    // });

    // const result = await model.invoke(["human", "Hello, how are you?"]);
    // console.log(result);

    console.log("Creating OllamaEmbeddings object to local llama3.1 model");
    const embedModel = new OllamaEmbeddings({
        model: 'llama3.1',
        baseUrl: 'http://127.0.0.1:11434'
    });

    console.log('Parsing csv into json array');
    const chunks = csvToJson.fieldDelimiter(',').getJsonFromCsv("./data/test.csv").map(record => JSON.stringify(record));
    console.log(`Loaded ${chunks.length} records from CSV file`);

    console.log('Creating vector store retriever');
    const vectoreStoreRetriever = await Chroma.fromTexts([chunks[0]], null, embedModel, {});

    console.log('Creating chat prompt template');
    const prompt = ChatPromptTemplate.fromTemplate(
        `Answer the following question to the best of your ability:\n{question}`
    );

    console.log('Creating prompt chain');
    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(embedModel).pipe(vectoreStoreRetriever).pipe(outputParser);

    console.log('Executing chain');
    const stream = await chain.stream({
        question: "Why is the most valuable card?",
    });

    for await (const chunk of stream) {
        console.log(chunk);
    }

})();
