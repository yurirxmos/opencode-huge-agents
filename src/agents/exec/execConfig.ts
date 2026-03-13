import { EXEC_PERSONA_CONFIG } from "../huge/personas/execPersona.js";
import { applyAgentAndCommands } from "../shared/configMerger.js";
import type { AgentConfig, CommandConfig, MutableConfig } from "../shared/types.js";

const EXEC_AGENT_NAME = "exec";
const EXEC_COMMAND_NAME = "exec";

const DEFAULT_EXEC_AGENT: AgentConfig = {
  description: EXEC_PERSONA_CONFIG.description,
  mode: "primary",
  color: EXEC_PERSONA_CONFIG.color,
  permission: EXEC_PERSONA_CONFIG.permission,
  prompt: EXEC_PERSONA_CONFIG.prompt,
};

const DEFAULT_EXEC_COMMAND: CommandConfig = {
  description: "Execute task with adaptive strategy (auto-selects mode)",
  agent: EXEC_AGENT_NAME,
  template:
    "Choose fast, balanced, or safe mode based on risk. Execute directly (fast) or plan first (balanced/safe). Task: $ARGUMENTS",
};

export function applyExecAgentConfig(config: MutableConfig): void {
  applyAgentAndCommands(config, EXEC_AGENT_NAME, DEFAULT_EXEC_AGENT, {
    [EXEC_COMMAND_NAME]: DEFAULT_EXEC_COMMAND,
  });
}
