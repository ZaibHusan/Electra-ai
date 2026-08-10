import {
    StateGraph,
    START,
    END,
} from "@langchain/langgraph";

import {
    ToolNode,
    toolsCondition,
} from "@langchain/langgraph/prebuilt";

import { AgentState } from "./state.js";
import { agentNode } from "./nodes/agent.node.js";
import { tools } from '../tools/rag.tool.js';
import { checkpointer } from '../memory/mongodb.checkpointer.js';

const workflow = new StateGraph(AgentState);

workflow.addNode("agent", agentNode);

workflow.addNode(
    "tools",
    new ToolNode(tools)
);

workflow.addEdge(
    START,
    "agent"
);

workflow.addConditionalEdges(
    "agent",
    toolsCondition
);

workflow.addEdge(
    "tools",
    "agent"
);

export const agentWorkflow = workflow.compile({
    checkpointer
});