const REFACTOR_AGENT_NAME = "refactor";
const REFACTOR_COMMAND_NAME = "refactor";
const REFACTOR_LEGIBILITY_COMMAND_NAME = "refactor-legibility";
const REFACTOR_PERFORMANCE_COMMAND_NAME = "refactor-performance";
const REFACTOR_MAINTAINABILITY_COMMAND_NAME = "refactor-maintainability";

const REFACTOR_AGENT_PROMPT = `You are the Refactor agent.

Objective:
Refactor existing code to improve readability, maintainability, consistency, and performance without changing functional behavior.

Execution policy:
- Never start editing code immediately.
- First run a review-style analysis and propose improvements.
- After analysis, present an interactive decision menu before editing.
- Match the menu language to the user's language when clear; otherwise use English.
- Then ask focused clarification questions if something is ambiguous.
- Only execute refactor changes after explicit user confirmation.
- If the user does not confirm execution, stop at analysis + plan.
- Never ask for confirmation as free text (for example, "confirma isso?").
- When asking for execution confirmation, always use a binary yes/no choice in the user's language (e.g., "Sim" and "Não").

Interactive menu requirements:
- Always present these options after the review summary:
  1) Apply all safe refactors now
  2) Apply only high-impact low-risk refactors
  3) Select refactor variant (legibility, performance, maintainability)
  4) Show a step-by-step plan without editing
  5) Ask me questions before any change
  6) Cancel
- Use the question tool when available to render selectable options.
- If the question tool is unavailable, render the same options as a numbered list.
- For final execution confirmation, use the question tool with exactly two options: yes and no (localized to user language).

Variant behavior:
- If variant is "legibility", prioritize naming clarity, simpler control flow, smaller functions, and reduced cognitive load.
- If variant is "performance", prioritize hotspot optimization, avoid unnecessary allocations/renders, and reduce expensive operations without changing behavior.
- If variant is "maintainability", prioritize modular boundaries, reusable abstractions, and easier future changes.
- If no variant is provided, default to "maintainability".

Rules:
- Preserve behavior exactly; avoid feature changes.
- Prefer small, reviewable, low-risk refactors.
- Reuse project conventions and existing architecture.
- Remove duplication and simplify control flow when safe.
- Keep public APIs and external contracts stable unless the user explicitly asks otherwise.
- When touching critical code paths, add or update tests if the project already uses tests.
- Validate with the project's available checks before finishing.
`;

interface AgentConfig {
  description?: string;
  mode?: "subagent" | "primary" | "all";
  prompt?: string;
  [key: string]: unknown;
}

interface CommandConfig {
  template: string;
  description?: string;
  agent?: string;
  [key: string]: unknown;
}

export interface MutableConfig {
  agent?: Record<string, AgentConfig | undefined>;
  command?: Record<string, CommandConfig | undefined>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeAgentConfig(defaultConfig: AgentConfig, existingConfig: AgentConfig): AgentConfig {
  const mergedConfig: AgentConfig = { ...defaultConfig };

  for (const [key, value] of Object.entries(existingConfig)) {
    const defaultValue = mergedConfig[key];
    if (isPlainObject(defaultValue) && isPlainObject(value)) {
      mergedConfig[key] = {
        ...defaultValue,
        ...value,
      };
      continue;
    }

    mergedConfig[key] = value;
  }

  return mergedConfig;
}

const DEFAULT_REFACTOR_AGENT: AgentConfig = {
  description: "orchestrates safe refactors to improve code quality.",
  mode: "primary",
  color: "#55f76dff",
  permission: {
    question: "allow",
  },
  prompt: REFACTOR_AGENT_PROMPT,
};

const DEFAULT_REFACTOR_COMMAND: CommandConfig = {
  description: "Run review-first refactor workflow with the refactor agent",
  agent: REFACTOR_AGENT_NAME,
  template:
    "Review this scope first and propose safe refactor improvements without editing yet. Ask clarifying questions and wait for explicit confirmation before applying changes. Scope: $ARGUMENTS",
};

const DEFAULT_REFACTOR_LEGIBILITY_COMMAND: CommandConfig = {
  description: "Run review-first legibility refactor workflow",
  agent: REFACTOR_AGENT_NAME,
  template:
    "Variant: legibility. Review this scope first and propose safe refactors focused on readability and clarity without editing yet. Ask clarifying questions and wait for explicit confirmation before applying changes. Scope: $ARGUMENTS",
};

const DEFAULT_REFACTOR_PERFORMANCE_COMMAND: CommandConfig = {
  description: "Run review-first performance refactor workflow",
  agent: REFACTOR_AGENT_NAME,
  template:
    "Variant: performance. Review this scope first and propose safe refactors focused on performance hotspots without editing yet. Ask clarifying questions and wait for explicit confirmation before applying changes. Scope: $ARGUMENTS",
};

const DEFAULT_REFACTOR_MAINTAINABILITY_COMMAND: CommandConfig = {
  description: "Run review-first maintainability refactor workflow",
  agent: REFACTOR_AGENT_NAME,
  template:
    "Variant: maintainability. Review this scope first and propose safe refactors focused on maintainability without editing yet. Ask clarifying questions and wait for explicit confirmation before applying changes. Scope: $ARGUMENTS",
};

export function applyRefactorAgentConfig(config: MutableConfig): void {
  const configuredAgents = config.agent ?? {};
  const existingRefactorAgent = configuredAgents[REFACTOR_AGENT_NAME] ?? {};

  configuredAgents[REFACTOR_AGENT_NAME] = mergeAgentConfig(
    DEFAULT_REFACTOR_AGENT,
    existingRefactorAgent,
  );

  config.agent = configuredAgents;

  const configuredCommands = config.command ?? {};
  configuredCommands[REFACTOR_COMMAND_NAME] = configuredCommands[REFACTOR_COMMAND_NAME] ?? DEFAULT_REFACTOR_COMMAND;
  configuredCommands[REFACTOR_LEGIBILITY_COMMAND_NAME] =
    configuredCommands[REFACTOR_LEGIBILITY_COMMAND_NAME] ?? DEFAULT_REFACTOR_LEGIBILITY_COMMAND;
  configuredCommands[REFACTOR_PERFORMANCE_COMMAND_NAME] =
    configuredCommands[REFACTOR_PERFORMANCE_COMMAND_NAME] ?? DEFAULT_REFACTOR_PERFORMANCE_COMMAND;
  configuredCommands[REFACTOR_MAINTAINABILITY_COMMAND_NAME] =
    configuredCommands[REFACTOR_MAINTAINABILITY_COMMAND_NAME] ?? DEFAULT_REFACTOR_MAINTAINABILITY_COMMAND;
  config.command = configuredCommands;
}
