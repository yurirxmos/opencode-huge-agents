import type { Plugin } from "@opencode-ai/plugin";
import type { MutableConfig } from "./agents/shared/types.js";
import { applyAskAgentConfig } from "./agents/ask/askConfig.js";
import { applyOrchestrateAgentConfig } from "./agents/orchestrate/orchestrateConfig.js";
import { applySolverAgentConfig } from "./agents/solver/solverConfig.js";

export const HugeAgentsPlugin: Plugin = async () => ({
  config: async (config) => {
    const mutableConfig = config as MutableConfig;
    
    // Register all 3 agents
    applyAskAgentConfig(mutableConfig);
    applyOrchestrateAgentConfig(mutableConfig);
    applySolverAgentConfig(mutableConfig);
  },
});

export default HugeAgentsPlugin;
