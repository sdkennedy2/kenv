import "@johnlindquist/kit";

await npm("openai");
debugger;
await npm("langchain");

const { OpenAI } = await import("langchain");
const { ConversationChain } = await import("langchain/chains");
const { BufferMemory } = await import("langchain/memory");

const OPEN_AI_KEY = await env("OPEN_AI_KEY");

const text = await getSelectedText();

const llm = new OpenAI({
  openAIApiKey: text,
  streaming: true,
  callbackManager: {
    handleStart: () => {
      chat.addMessage("");
    },
    handleNewToken: (token) => {
      chat.pushToken(token);
    },
  },
});

const memory = new BufferMemory();
const chain = new ConversationChain({
  llm,
  memory,
});

const messages = await chat({
  ignoreBlur: true,
  alwaysOnTop: true,
  onSubmit: async (input) => {
    await chain.call({ input });
  },
});
