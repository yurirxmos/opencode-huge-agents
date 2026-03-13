import { REFACTOR_PERSONA_CONFIG } from "../huge/personas/refactorPersona.js";
import { applyAgentAndCommands } from "../shared/configMerger.js";
import type { AgentConfig, CommandConfig, MutableConfig } from "../shared/types.js";

const REFACTOR_AGENT_NAME = "refactor";
const REFACTOR_COMMAND_NAME = "refactor";

const DEFAULT_REFACTOR_AGENT: AgentConfig = {
  description: REFACTOR_PERSONA_CONFIG.description,
  mode: "primary",
  color: REFACTOR_PERSONA_CONFIG.color,
  permission: REFACTOR_PERSONA_CONFIG.permission,
  prompt: REFACTOR_PERSONA_CONFIG.prompt,
};

const DEFAULT_REFACTOR_COMMAND: CommandConfig = {
  description: "Run review-first refactor workflow with the refactor agent",
  agent: REFACTOR_AGENT_NAME,
  template:
    "Review this scope first and propose safe refactor improvements without editing yet. Ask clarifying questions and wait for explicit confirmation before applying changes. Scope: $ARGUMENTS",
};

export function applyRefactorAgentConfig(config: MutableConfig): void {
  applyAgentAndCommands(config, REFACTOR_AGENT_NAME, DEFAULT_REFACTOR_AGENT, {
    [REFACTOR_COMMAND_NAME]: DEFAULT_REFACTOR_COMMAND,
  });
}
