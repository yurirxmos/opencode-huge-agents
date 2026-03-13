// Shared utilities for merging configurations

import type { AgentConfig, CommandConfig, MutableConfig } from "./types.js";

/**
 * Checks if a value is a plain object (and not an array or null)
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Safely merges agent configurations.
 * Preserves existing user settings while applying defaults.
 */
export function mergeAgentConfig(
  defaultConfig: AgentConfig,
  existingConfig: AgentConfig,
): AgentConfig {
  const mergedConfig: AgentConfig = { ...defaultConfig };

  for (const [key, value] of Object.entries(existingConfig)) {
    const defaultValue = mergedConfig[key];
    // If both are plain objects, merge recursively
    if (isPlainObject(defaultValue) && isPlainObject(value)) {
      mergedConfig[key] = {
        ...defaultValue,
        ...value,
      };
      continue;
    }

    // Otherwise, use the existing value
    mergedConfig[key] = value;
  }

  return mergedConfig;
}

/**
 * Applies agent and command configurations to the OpenCode config.
 * Centralizes the registration logic that was duplicated in each agent.
 */
export function applyAgentAndCommands(
  config: MutableConfig,
  agentName: string,
  agentConfig: AgentConfig,
  commands: Record<string, CommandConfig>,
): void {
  // Register the agent
  const configuredAgents = config.agent ?? {};
  const existingAgent = configuredAgents[agentName] ?? {};
  configuredAgents[agentName] = mergeAgentConfig(agentConfig, existingAgent);
  config.agent = configuredAgents;

  // Register the commands
  const configuredCommands = config.command ?? {};
  for (const [commandName, commandConfig] of Object.entries(commands)) {
    configuredCommands[commandName] = configuredCommands[commandName] ?? commandConfig;
  }
  config.command = configuredCommands;
}
