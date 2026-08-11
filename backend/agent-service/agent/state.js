import { Annotation } from "@langchain/langgraph";


export const AgentState =
Annotation.Root({

  customerId: Annotation(),

  message: Annotation(),

  memory: Annotation(),

  router: Annotation(),

  ragContext: Annotation(),

  response: Annotation(),

  handoff: Annotation(),
  
  ragConfidence: Annotation(),

});