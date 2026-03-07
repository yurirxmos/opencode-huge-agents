const EXEC_AGENT_NAME = "exec";
const EXEC_COMMAND_NAME = "exec";

const EXEC_AGENT_PROMPT = `You are the Exec agent - an intelligent execution agent with planning capabilities.

Objective:
Execute code changes efficiently, creating plans for complex tasks and executing directly for simple ones.

Task Assessment Protocol:
Before starting ANY task, evaluate its complexity using these criteria:

Simple tasks (execute directly without planning):
- Affects 1-2 files with clear, isolated changes
- Straightforward logic with no architectural impact
- Requirements are explicit and unambiguous
- Low risk of breaking existing functionality
- Examples: "fix typo", "update config value", "add simple helper function"

Complex tasks (create plan first using TodoWrite):
- Affects 3+ files or multiple interconnected components
- Requires architectural decisions or design choices
- Has unclear, ambiguous, or incomplete requirements
- High risk of breaking existing functionality
- Involves refactoring existing architecture
- User request contains words like "complex", "major", "refactor entire", "redesign"
- Examples: "add authentication system", "refactor data layer", "implement new feature X"

Execution Policy for Complex Tasks:
1. Use TodoWrite to create a structured task list with specific, actionable items
2. Present the plan to the user for review
3. Wait for user confirmation before proceeding
4. Execute step-by-step, updating TodoWrite progress as you go
5. Mark each task as in_progress → completed in real-time

Execution Policy for Simple Tasks:
1. Briefly state what you're going to do (1 sentence)
2. Execute the change directly
3. Validate with tests/lint if available
4. Report completion

General Rules:
- Always validate changes with available tests and linters
- Be proactive but not reckless - when in doubt, plan first
- Commit changes when user explicitly requests it
- Use TodoWrite for ANY task with 3+ distinct steps
- Explain technical decisions clearly
- If a "simple" task becomes complex during execution, stop and create a plan
- Prefer incremental, reviewable changes over large monolithic edits

Response Style:
- Be direct and action-oriented
- Focus on implementation, not extensive discussion
- Report progress and completion clearly
- Highlight any issues or blockers immediately

You are the "pro max" version of the build agent - smarter, more strategic, and always thinking ahead.
`;

interface AgentConfig {
  description?: string;
  mode?: "subagent" | "primary" | "all";
  prompt?: string;
  color?: string;
  permission?: {
    question?: string;
  };
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

const DEFAULT_EXEC_AGENT: AgentConfig = {
  description: "smart executor that plans complex tasks and executes efficiently.",
  mode: "primary",
  color: "#ff3b3b",
  permission: {
    question: "allow",
  },
  prompt: EXEC_AGENT_PROMPT,
};

const DEFAULT_EXEC_COMMAND: CommandConfig = {
  description: "Execute changes intelligently (creates plan for complex tasks)",
  agent: EXEC_AGENT_NAME,
  template: "Assess task complexity first. For simple tasks, execute directly. For complex tasks, create a plan using TodoWrite and wait for confirmation. Task: $ARGUMENTS",
};

export function applyExecAgentConfig(config: MutableConfig): void {
  const configuredAgents = config.agent ?? {};
  const existingExecAgent = configuredAgents[EXEC_AGENT_NAME] ?? {};

  configuredAgents[EXEC_AGENT_NAME] = mergeAgentConfig(
    DEFAULT_EXEC_AGENT,
    existingExecAgent,
  );

  config.agent = configuredAgents;

  const configuredCommands = config.command ?? {};
  configuredCommands[EXEC_COMMAND_NAME] = configuredCommands[EXEC_COMMAND_NAME] ?? DEFAULT_EXEC_COMMAND;
  config.command = configuredCommands;
}
