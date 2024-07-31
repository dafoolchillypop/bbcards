const { ChatOllama } = require("@langchain/ollama");

(async function() {
    const model = new ChatOllama({
        model: "llama3.1",  // Default value.
        baseUrl: 'http://127.0.0.1:11434'
      });

      const result = await model.invoke(["human", "Hello, how are you?"]);
      console.log(result);
})();
