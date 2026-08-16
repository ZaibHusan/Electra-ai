import {
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";

import { AgentState } from "./state.js";
import { checkSystemNode } from "./nodes/checkSystem.node.js";
import { loadMemoryNode } from "./nodes/loadMemory.node.js";
import { salesRouterNode } from "./nodes/salesRouter.node.js";
import { ragNode } from "./nodes/rag.node.js";
import { skipRagNode } from "./nodes/skipRag.node.js";
import { salesExpertNode } from "./nodes/salesExpert.node.js";
import { updateMemoryNode } from "./nodes/updateMemory.node.js";
import { handoffNode } from "./nodes/handoff.node.js";

import { routeDecision } from "./router/routeDecision.js";
import { loadMemoryDecision } from "./router/loadMemoryDecision.js";
import { systemCheckDecision } from "./router/systemCheckDecision.js";
import { checkpointer } from "../memory/mongodb.checkpointer.js";

const workflow = new StateGraph(AgentState);

// =====================
// Nodes
// =====================

workflow.addNode(
  "checkSystem",
  checkSystemNode
);

workflow.addNode(
  "loadMemory",
  loadMemoryNode
);

workflow.addNode(
  "salesRouter",
  salesRouterNode
);

workflow.addNode(
  "rag",
  ragNode
);

workflow.addNode(
  "skipRag",
  skipRagNode
);

workflow.addNode(
  "salesExpert",
  salesExpertNode
);

workflow.addNode(
  "updateMemory",
  updateMemoryNode
);

workflow.addNode(
  "processHandoff",
  handoffNode
);

// =====================
// Start Flow & Kill Switch Check
// =====================

workflow.addEdge(
  START,
  "checkSystem"
);

workflow.addConditionalEdges(
  "checkSystem",
  systemCheckDecision,
  {
    continue: "loadMemory",
    end: END,
  }
);

// =====================
// Memory Check
// =====================

workflow.addConditionalEdges(
  "loadMemory",
  loadMemoryDecision,
  {
    continue: "salesRouter",
    end: END,
  }
);

// =====================
// Sales Router
// =====================

workflow.addConditionalEdges(
  "salesRouter",
  routeDecision,
  {
    rag: "rag",
    direct: "skipRag",
  }
);

// =====================
// Merge Branches
// =====================

workflow.addEdge(
  "rag",
  "salesExpert"
);

workflow.addEdge(
  "skipRag",
  "salesExpert"
);

// =====================
// Main Flow
// =====================

workflow.addEdge(
  "salesExpert",
  "updateMemory"
);

workflow.addEdge(
  "updateMemory",
  "processHandoff"
);

workflow.addEdge(
  "processHandoff",
  END
);

export const agentWorkflow = workflow.compile({
  checkpointer,
});