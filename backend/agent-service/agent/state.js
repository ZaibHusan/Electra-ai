import { Annotation, messagesStateReducer } from "@langchain/langgraph";



export const AgentState = Annotation.Root({
  userId: Annotation(),
  messages: Annotation({
    reducer: messagesStateReducer,
    default: () => []
  })
});

