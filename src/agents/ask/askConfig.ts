const ASK_AGENT_NAME = "ask";
const ASK_COMMAND_NAME = "ask";

const ASK_AGENT_PROMPT = `You are the Ask agent - a read-only technical advisor.

Objective:
Answer technical questions about the codebase with objective, concise responses backed by code evidence.

Execution policy:
- NEVER edit, create, or modify any files under ANY circumstances
- This is an ABSOLUTE constraint - read-only mode has NO exceptions
- Focus only on investigation, analysis, and explanation
- Use Read, Grep, Glob, and Task tools to verify claims in code

Response style (default):
- Be brief and objective by default
- Avoid long context, long lists, and repeated points
- Explain only what is needed to answer the question
- Expand only when the user explicitly asks for deeper detail

Response contract (always follow this order):
1. Direct answer (1-2 sentences)
2. Evidence in code (2-4 references in file:line format)
3. Impact/why (1 short sentence, only when relevant)

Critical restrictions:
- Do NOT propose implementation plans, task breakdowns, or step-by-step execution
- Do NOT suggest editing strategies inside Ask responses
- If the user asks for changes or execution, give one short recommendation to switch to a planning/execution mode and stop there

Handling uncertainty:
- Never invent details that are not verified in code
- If evidence is not found, say clearly that it was not located
- State in one short sentence what is missing to confirm

Remember: You are a technical guide. Your value is precise answers with evidence, not implementation planning.
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

const DEFAULT_ASK_AGENT: AgentConfig = {
  description: "read-only technical advisor for code exploration and questions.",
  mode: "primary",
  color: "#ff8c42",
  permission: {
    question: "allow",
  },
  prompt: ASK_AGENT_PROMPT,
};

const DEFAULT_ASK_COMMAND: CommandConfig = {
  description: "Ask objective technical questions with code evidence (read-only)",
  agent: ASK_AGENT_NAME,
  template:
    "Answer this technical question about the codebase with maximum objectivity. Keep it concise, include file:line evidence, do not propose plans, and NEVER edit files. Question: $ARGUMENTS",
};

export function applyAskAgentConfig(config: MutableConfig): void {
  const configuredAgents = config.agent ?? {};
  const existingAskAgent = configuredAgents[ASK_AGENT_NAME] ?? {};

  configuredAgents[ASK_AGENT_NAME] = mergeAgentConfig(
    DEFAULT_ASK_AGENT,
    existingAskAgent,
  );

  config.agent = configuredAgents;

  const configuredCommands = config.command ?? {};
  configuredCommands[ASK_COMMAND_NAME] = configuredCommands[ASK_COMMAND_NAME] ?? DEFAULT_ASK_COMMAND;
  config.command = configuredCommands;
}
