import type { Plugin } from "@opencode-ai/plugin";
import type { MutableConfig } from "./agents/shared/types.js";
import { applyRefactorAgentConfig } from "./agents/refactor/refactorConfig.js";
import { applyAskAgentConfig } from "./agents/ask/askConfig.js";
import { applyExecAgentConfig } from "./agents/exec/execConfig.js";

export const HugeAgentsPlugin: Plugin = async () => ({
  config: async (config) => {
    const mutableConfig = config as MutableConfig;
    
    // Register all 3 agents
    applyRefactorAgentConfig(mutableConfig);
    applyAskAgentConfig(mutableConfig);
    applyExecAgentConfig(mutableConfig);
  },
});

export default HugeAgentsPlugin;
