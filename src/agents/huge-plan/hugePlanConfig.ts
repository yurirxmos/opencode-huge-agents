import { HUGE_PLAN_PERSONA_CONFIG } from "../huge/personas/hugePlanPersona.js";
import { applyAgentAndCommands } from "../shared/configMerger.js";
import type { AgentConfig, CommandConfig, MutableConfig } from "../shared/types.js";

const HUGE_PLAN_AGENT_NAME = "huge-plan";
const HUGE_PLAN_COMMAND_NAME = "huge-plan";

const DEFAULT_HUGE_PLAN_AGENT: AgentConfig = {
  description: HUGE_PLAN_PERSONA_CONFIG.description,
  mode: "primary",
  color: HUGE_PLAN_PERSONA_CONFIG.color,
  permission: HUGE_PLAN_PERSONA_CONFIG.permission,
  prompt: HUGE_PLAN_PERSONA_CONFIG.prompt,
};

const DEFAULT_HUGE_PLAN_COMMAND: CommandConfig = {
  description: "Clarify what to build and produce a concise implementation plan",
  agent: HUGE_PLAN_AGENT_NAME,
  template:
    "Clarify what the user wants to build, rewrite the request as a clear goal, ask only the highest-impact questions, and produce a concise implementation plan without editing. Request: $ARGUMENTS",
};

export function applyHugePlanAgentConfig(config: MutableConfig): void {
  applyAgentAndCommands(config, HUGE_PLAN_AGENT_NAME, DEFAULT_HUGE_PLAN_AGENT, {
    [HUGE_PLAN_COMMAND_NAME]: DEFAULT_HUGE_PLAN_COMMAND,
  });
}
