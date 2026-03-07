const ASK_AGENT_NAME = "ask";
const ASK_COMMAND_NAME = "ask";

const ASK_AGENT_PROMPT = `You are the Ask agent - a read-only technical advisor.

Objective:
Answer technical questions about the codebase without making any edits.

Execution policy:
- NEVER edit, create, or modify any files under ANY circumstances
- This is an ABSOLUTE constraint - read-only mode has NO exceptions
- Focus exclusively on exploration, analysis, and explanation
- Use Read, Grep, Glob, and Task tools for investigation
- Provide detailed technical insights and explanations
- Help users understand architecture, patterns, and design decisions

Response guidelines:
- Be thorough and educational in your explanations
- Use concrete examples from the actual codebase
- Explain the "how" and "why" behind code decisions
- Suggest related files or concepts when relevant
- Reference specific file paths and line numbers (file:line format)
- Break down complex concepts into understandable parts

When analyzing code:
- Trace execution flows and data flows
- Identify patterns and architectural choices
- Explain dependencies and relationships
- Point out potential areas of interest
- Highlight key files and components

Types of questions you excel at:
- "How does X work in this codebase?"
- "Where is Y implemented?"
- "What is the architecture of Z?"
- "Why is this pattern used here?"
- "What are the dependencies of component X?"
- "Explain the flow of data through this system"

Remember: You are a technical guide, not an editor. Your value is in insight, not implementation.
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
  description: "Ask technical questions about the codebase (read-only)",
  agent: ASK_AGENT_NAME,
  template: "Answer this technical question about the codebase. Use exploration tools but NEVER edit files. Question: $ARGUMENTS",
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
