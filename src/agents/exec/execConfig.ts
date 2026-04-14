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
  description: "Plan first, keep clarifying, then execute on implement now",
  agent: EXEC_AGENT_NAME,
  template:
    "Enter read-only planning mode first. Investigate the task, produce a concise implementation plan, keep answering doubts and revising the plan until the user is satisfied, and end every planning response with an interactive menu whose first option is exactly 'implement now'. Execute only after the user explicitly chooses 'implement now'. Task: $ARGUMENTS",
};

export function applyExecAgentConfig(config: MutableConfig): void {
  applyAgentAndCommands(config, EXEC_AGENT_NAME, DEFAULT_EXEC_AGENT, {
    [EXEC_COMMAND_NAME]: DEFAULT_EXEC_COMMAND,
  });
}
