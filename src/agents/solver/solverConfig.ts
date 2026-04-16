import { SOLVER_PERSONA_CONFIG } from "../personas/solverPersona.js";
import { applyAgentAndCommands } from "../shared/configMerger.js";
import type { AgentConfig, CommandConfig, MutableConfig } from "../shared/types.js";

const SOLVER_AGENT_NAME = "solver";
const SOLVER_COMMAND_NAME = "solver";

const DEFAULT_SOLVER_AGENT: AgentConfig = {
  description: SOLVER_PERSONA_CONFIG.description,
  mode: "primary",
  color: SOLVER_PERSONA_CONFIG.color,
  permission: SOLVER_PERSONA_CONFIG.permission,
  prompt: SOLVER_PERSONA_CONFIG.prompt,
};

const DEFAULT_SOLVER_COMMAND: CommandConfig = {
  description: "Explore solution strategies, recommend one path, and produce a clear plan",
  agent: SOLVER_AGENT_NAME,
  template: "Request: $ARGUMENTS",
};

export function applySolverAgentConfig(config: MutableConfig): void {
  applyAgentAndCommands(config, SOLVER_AGENT_NAME, DEFAULT_SOLVER_AGENT, {
    [SOLVER_COMMAND_NAME]: DEFAULT_SOLVER_COMMAND,
  });
}
