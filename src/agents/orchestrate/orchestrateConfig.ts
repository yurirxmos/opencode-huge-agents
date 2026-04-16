import { ORCHESTRATE_PERSONA_CONFIG } from "../personas/orchestratePersona.js";
import { applyAgentAndCommands } from "../shared/configMerger.js";
import type { AgentConfig, CommandConfig, MutableConfig } from "../shared/types.js";

const ORCHESTRATE_AGENT_NAME = "orchestrate";
const ORCHESTRATE_COMMAND_NAME = "orchestrate";

const DEFAULT_ORCHESTRATE_AGENT: AgentConfig = {
  description: ORCHESTRATE_PERSONA_CONFIG.description,
  mode: "primary",
  color: ORCHESTRATE_PERSONA_CONFIG.color,
  permission: ORCHESTRATE_PERSONA_CONFIG.permission,
  prompt: ORCHESTRATE_PERSONA_CONFIG.prompt,
};

const DEFAULT_ORCHESTRATE_COMMAND: CommandConfig = {
  description: "Build an implementation plan, then ask whether to apply it",
  agent: ORCHESTRATE_AGENT_NAME,
  template: "Task: $ARGUMENTS",
};

export function applyOrchestrateAgentConfig(config: MutableConfig): void {
  applyAgentAndCommands(config, ORCHESTRATE_AGENT_NAME, DEFAULT_ORCHESTRATE_AGENT, {
    [ORCHESTRATE_COMMAND_NAME]: DEFAULT_ORCHESTRATE_COMMAND,
  });
}
