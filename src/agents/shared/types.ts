// Shared types used by all agents

export type Persona = "ask" | "exec" | "refactor";

export interface AgentConfig {
  description?: string;
  mode?: "subagent" | "primary" | "all";
  prompt?: string;
  color?: string;
  permission?: {
    question?: string;
  };
  [key: string]: unknown;
}

export interface CommandConfig {
  template: string;
  description?: string;
  agent?: string;
  [key: string]: unknown;
}

export interface MutableConfig {
  agent?: Record<string, AgentConfig | undefined>;
  command?: Record<string, CommandConfig | undefined>;
}

// Defines the configuration for a persona
export interface PersonaConfig {
  prompt: string;
  description: string;
  color: string;
  permission?: {
    question?: string;
  };
}
