import type { Plugin } from "@opencode-ai/plugin";
import type { MutableConfig } from "./agents/shared/types.js";
import { applyAskAgentConfig } from "./agents/ask/askConfig.js";
import { applyExecAgentConfig } from "./agents/exec/execConfig.js";
import { applyHugePlanAgentConfig } from "./agents/huge-plan/hugePlanConfig.js";

export const HugeAgentsPlugin: Plugin = async () => ({
  config: async (config) => {
    const mutableConfig = config as MutableConfig;
    
    // Register all 3 agents
    applyAskAgentConfig(mutableConfig);
    applyExecAgentConfig(mutableConfig);
    applyHugePlanAgentConfig(mutableConfig);
  },
});

export default HugeAgentsPlugin;
