// Utilitários compartilhados para merge de configurações

import type { AgentConfig, CommandConfig, MutableConfig } from "./types.js";

/**
 * Verifica se um valor é um objeto plano (não array, não null)
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Faz merge seguro de configurações de agente
 * Preserva configurações existentes do usuário enquanto aplica defaults
 */
export function mergeAgentConfig(
  defaultConfig: AgentConfig,
  existingConfig: AgentConfig,
): AgentConfig {
  const mergedConfig: AgentConfig = { ...defaultConfig };

  for (const [key, value] of Object.entries(existingConfig)) {
    const defaultValue = mergedConfig[key];
    // Se ambos são objetos planos, faz merge recursivo
    if (isPlainObject(defaultValue) && isPlainObject(value)) {
      mergedConfig[key] = {
        ...defaultValue,
        ...value,
      };
      continue;
    }

    // Caso contrário, usa o valor existente
    mergedConfig[key] = value;
  }

  return mergedConfig;
}

/**
 * Aplica configuração de agente e comandos ao config do OpenCode
 * Centraliza a lógica de registro que era duplicada em cada agente
 */
export function applyAgentAndCommands(
  config: MutableConfig,
  agentName: string,
  agentConfig: AgentConfig,
  commands: Record<string, CommandConfig>,
): void {
  // Registra o agente
  const configuredAgents = config.agent ?? {};
  const existingAgent = configuredAgents[agentName] ?? {};
  configuredAgents[agentName] = mergeAgentConfig(agentConfig, existingAgent);
  config.agent = configuredAgents;

  // Registra os comandos
  const configuredCommands = config.command ?? {};
  for (const [commandName, commandConfig] of Object.entries(commands)) {
    configuredCommands[commandName] = configuredCommands[commandName] ?? commandConfig;
  }
  config.command = configuredCommands;
}
