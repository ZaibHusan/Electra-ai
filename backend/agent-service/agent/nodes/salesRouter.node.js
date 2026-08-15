import { z } from "zod";
import { GetLlmModel } from "../../llm/model.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ROUTER_PROMPT } from "../../prompt/router.prompt.js";
import getTokens from "../../utils/getToken.js";

const routerSchema = z.object({
  route: z.enum(["rag", "direct"]),

  ragQuery: z.string().optional(),

  stage: z.enum([
    "NEW",
    "INTEREST",
    "CONSIDERATION",
    "DECISION",
    "HOT_LEAD"
  ]),

  goal: z.string(),

  leadScoreDelta: z.number()
    .int()
    .min(-10)
    .max(30),

  needHandoff: z.boolean(),

  facts: z.object({
    name: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    budget: z.string().nullable().optional(),
    product: z.string().nullable().optional(),
  }),
}).strict();
export const salesRouterNode = async (state) => {
  const llm = GetLlmModel("gemini");

  const structuredLlm = llm.withStructuredOutput(routerSchema, {
    name: "sales_router_decision"
  });

  const result = await structuredLlm.invoke([
    new SystemMessage(ROUTER_PROMPT),
    new HumanMessage(`
Memory:
${JSON.stringify(state.memory)}

Customer Message:
${state.message}
`)
  ]);

  const token = await getTokens(result);
  const currentToken = state.totalTokens || 0;

  console.log(`Token usage: ${token}`);
  return {
    ...state,
    router: result,
    totalTokens: currentToken + token
  };
};