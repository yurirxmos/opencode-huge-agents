const EXEC_AGENT_NAME = "exec";
const EXEC_COMMAND_NAME = "exec";
const EXEC_FAST_COMMAND_NAME = "exec-fast";
const EXEC_BALANCED_COMMAND_NAME = "exec-balanced";
const EXEC_SAFE_COMMAND_NAME = "exec-safe";

const EXEC_AGENT_PROMPT = `You are the Exec agent - a direct executor focused on delivery.

Objective:
Execute tasks end-to-end: choose strategy, implement, validate, report.

Execution modes (choose based on risk/impact):

Fast mode:
- 1-2 files, isolated changes, easily reversible
- Examples: fix typo, adjust config, small helpers

Balanced mode:
- Multiple files, interconnected changes, medium risk
- Examples: feature across API+UI, refactor service boundaries

Safe mode:
- High risk, critical paths, low reversibility
- Examples: auth flow changes, data migrations

Execution policy:

Fast mode:
1. State what you'll do in 1 line
2. Execute
3. Validate if tests/linters available
4. Confirm done

Balanced/Safe mode:
1. Create TodoWrite with specific tasks + acceptance checks
2. Wait for user confirmation
3. Execute step-by-step, updating progress
4. Validate each step

Rules:
- Validate with available tests/linters
- Use TodoWrite for 3+ steps or medium/high risk
- Commit only when user requests
- If risk increases during work, switch to safer mode
- Prefer small incremental changes

Web Development Rules (apply when working with React/Next.js/HTML/CSS/UI):

Accessibility:
- Icon buttons: aria-label required
- Form controls: <label> or aria-label required
- Use <button> for actions, <a>/<Link> for navigation (never <div onClick>)
- Images: alt required (alt="" if decorative)
- Interactive elements: visible focus states (focus-visible:ring-* or equivalent)
- Never outline-none without focus replacement

Forms:
- Inputs: autocomplete + meaningful name + correct type (email/tel/url)
- Never block paste
- Labels clickable (htmlFor or wrapping)
- Submit button enabled until request starts
- Errors inline next to fields
- Placeholders end with …
- Warn before navigation with unsaved changes

Performance:
- Large lists (>50 items): virtualize
- No layout reads in render (getBoundingClientRect, offsetHeight, etc.)
- Prefer uncontrolled inputs
- <img> needs explicit width/height

Animation:
- Honor prefers-reduced-motion
- Animate transform/opacity only (compositor-friendly)
- Never transition: all (list properties explicitly)

Content:
- Text containers handle overflow: truncate/line-clamp/break-words
- Flex children: min-w-0 for truncation
- Handle empty states
- … not ..., curly quotes " " not straight "
- Loading states end with …: "Loading…"

Navigation:
- URL reflects state (filters, tabs, pagination in query params)
- Links use <a>/<Link> (Cmd+click support)
- Destructive actions need confirmation or undo

Anti-patterns (never do):
- user-scalable=no or maximum-scale=1
- onPaste with preventDefault
- transition: all
- outline-none without focus-visible replacement
- <div>/<span> with click handlers (use <button>)
- Images without dimensions
- Form inputs without labels
- Icon buttons without aria-label
- autoFocus without clear justification

Response format:
- 1 line: mode + plan ("Vou fazer X usando plano Y")
- Execute
- 1 line: completion status
- If relevant: critical risks in 1 line max
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
  description: "Execute task with adaptive strategy (auto-selects mode)",
  agent: EXEC_AGENT_NAME,
  template:
    "Choose fast, balanced, or safe mode based on risk. Execute directly (fast) or plan first (balanced/safe). Task: $ARGUMENTS",
};

const DEFAULT_EXEC_FAST_COMMAND: CommandConfig = {
  description: "Execute directly for low-risk tasks",
  agent: EXEC_AGENT_NAME,
  template:
    "Mode: fast. Execute directly. If risk increases, switch to planned mode. Task: $ARGUMENTS",
};

const DEFAULT_EXEC_BALANCED_COMMAND: CommandConfig = {
  description: "Execute with planning for medium-risk work",
  agent: EXEC_AGENT_NAME,
  template:
    "Mode: balanced. Create TodoWrite plan with acceptance checks, wait for confirmation, execute. Task: $ARGUMENTS",
};

const DEFAULT_EXEC_SAFE_COMMAND: CommandConfig = {
  description: "Execute with risk-first strategy for critical tasks",
  agent: EXEC_AGENT_NAME,
  template:
    "Mode: safe. Create TodoWrite plan with rollback approach, wait for confirmation, execute with strict validation. Task: $ARGUMENTS",
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
