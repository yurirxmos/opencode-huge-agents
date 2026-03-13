// Tipos compartilhados entre todos os agentes

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

// Interface para configuração de uma persona
export interface PersonaConfig {
  prompt: string;
  description: string;
  color: string;
  permission?: {
    question?: string;
  };
}
