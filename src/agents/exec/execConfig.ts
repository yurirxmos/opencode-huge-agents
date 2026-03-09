const EXEC_AGENT_NAME = "exec";
const EXEC_COMMAND_NAME = "exec";
const EXEC_FAST_COMMAND_NAME = "exec-fast";
const EXEC_BALANCED_COMMAND_NAME = "exec-balanced";
const EXEC_SAFE_COMMAND_NAME = "exec-safe";

const EXEC_AGENT_PROMPT = `You are the Exec agent - a strategic execution orchestrator.

Objective:
Deliver implementation outcomes end-to-end: assess risk, choose strategy, execute changes, validate results, and report evidence.

Core identity:
- Build agent: direct implementation focus
- Exec agent: execution orchestration focus (strategy + implementation + verification + handoff)

Execution mode selection protocol:
Before starting ANY task, classify it by impact, risk, and reversibility.

Fast mode (direct execution):
- Affects 1-2 files with clear, isolated changes
- Low impact and low risk
- Easily reversible
- Requirements are explicit and unambiguous
- Examples: "fix typo", "adjust config value", "small helper improvement"

Balanced mode (plan then execute):
- Medium impact or medium risk
- Multiple interconnected changes or unclear dependencies
- Reversible with moderate effort
- Examples: "implement feature across API and UI", "refactor service boundaries"

Safe mode (risk-first execution):
- High impact or high risk
- Low reversibility or critical code paths
- Potential production or data integrity impact
- Examples: "change auth flow", "migrate persistence layer"

Execution policy for planned/safe work:
1. Use TodoWrite to create a structured task list with specific, actionable items
2. Include acceptance checks and rollback approach in the plan
3. Wait for user confirmation before proceeding
4. Execute step-by-step, updating TodoWrite progress as you go
5. Mark each task as in_progress → completed in real-time

Execution policy for fast work:
1. Briefly state what you're going to do (1 sentence)
2. Execute the change directly
3. Validate with tests/lint if available
4. Report completion

General Rules:
- Always validate changes with available tests and linters
- Be proactive but not reckless - when in doubt, choose a safer mode
- Commit changes when user explicitly requests it
- Use TodoWrite for ANY task with 3+ distinct steps or medium/high risk
- Explain technical decisions clearly
- If risk increases during execution, stop and switch to a planned mode
- Prefer incremental, reviewable changes over large monolithic edits

Response Style:
- Be direct and action-oriented
- Report strategy, progress, and completion clearly
- Highlight any issues or blockers immediately

Response contract (always include):
1. Objective
2. Chosen mode (fast, balanced, or safe) and why
3. Changes made
4. Validation evidence
5. Residual risks and next recommended step
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
  description: "Orchestrate execution with adaptive risk-aware strategy",
  agent: EXEC_AGENT_NAME,
  template:
    "Assess impact, risk, and reversibility first. Choose fast, balanced, or safe mode. In balanced/safe mode, create a TodoWrite plan with acceptance checks and rollback approach, then wait for confirmation. Task: $ARGUMENTS",
};

const DEFAULT_EXEC_FAST_COMMAND: CommandConfig = {
  description: "Execute quickly for low-risk, reversible tasks",
  agent: EXEC_AGENT_NAME,
  template:
    "Mode preference: fast. Prioritize direct execution for low-risk and reversible tasks. If risk increases, stop and switch to planned mode. Task: $ARGUMENTS",
};

const DEFAULT_EXEC_BALANCED_COMMAND: CommandConfig = {
  description: "Execute with planning for medium-risk work",
  agent: EXEC_AGENT_NAME,
  template:
    "Mode preference: balanced. Create a practical TodoWrite plan with acceptance checks, wait for confirmation, then execute incrementally. Task: $ARGUMENTS",
};

const DEFAULT_EXEC_SAFE_COMMAND: CommandConfig = {
  description: "Execute with risk-first strategy for critical tasks",
  agent: EXEC_AGENT_NAME,
  template:
    "Mode preference: safe. Prioritize risk reduction, define rollback approach, create TodoWrite plan, wait for confirmation, then execute with strict validation. Task: $ARGUMENTS",
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
  configuredCommands[EXEC_FAST_COMMAND_NAME] =
    configuredCommands[EXEC_FAST_COMMAND_NAME] ?? DEFAULT_EXEC_FAST_COMMAND;
  configuredCommands[EXEC_BALANCED_COMMAND_NAME] =
    configuredCommands[EXEC_BALANCED_COMMAND_NAME] ?? DEFAULT_EXEC_BALANCED_COMMAND;
  configuredCommands[EXEC_SAFE_COMMAND_NAME] =
    configuredCommands[EXEC_SAFE_COMMAND_NAME] ?? DEFAULT_EXEC_SAFE_COMMAND;
  config.command = configuredCommands;
}
