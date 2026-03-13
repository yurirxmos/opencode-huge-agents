import { ASK_PERSONA_CONFIG } from "../huge/personas/askPersona.js";
import { applyAgentAndCommands } from "../shared/configMerger.js";
import type { AgentConfig, CommandConfig, MutableConfig } from "../shared/types.js";

const ASK_AGENT_NAME = "ask";
const ASK_COMMAND_NAME = "ask";

const DEFAULT_ASK_AGENT: AgentConfig = {
  description: ASK_PERSONA_CONFIG.description,
  mode: "primary",
  color: ASK_PERSONA_CONFIG.color,
  permission: ASK_PERSONA_CONFIG.permission,
  prompt: ASK_PERSONA_CONFIG.prompt,
};

const DEFAULT_ASK_COMMAND: CommandConfig = {
  description: "Ask objective technical questions with code evidence (read-only)",
  agent: ASK_AGENT_NAME,
  template:
    "Answer this technical question about the codebase with maximum objectivity. Keep it concise, include file:line evidence, do not propose plans, and NEVER edit files. Question: $ARGUMENTS",
};

export function applyAskAgentConfig(config: MutableConfig): void {
  applyAgentAndCommands(config, ASK_AGENT_NAME, DEFAULT_ASK_AGENT, {
    [ASK_COMMAND_NAME]: DEFAULT_ASK_COMMAND,
  });
}
