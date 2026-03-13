// Testes para configMerger - verifica merge seguro de configurações

import { describe, expect, it } from "bun:test";
import { isPlainObject, mergeAgentConfig, applyAgentAndCommands } from "../src/agents/shared/configMerger";
import type { AgentConfig, MutableConfig } from "../src/agents/shared/types";

describe("isPlainObject", () => {
  it("deve retornar true para objetos planos", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject({ nested: { b: 2 } })).toBe(true);
  });

  it("deve retornar false para não-objetos", () => {
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
    expect(isPlainObject("string")).toBe(false);
    expect(isPlainObject(123)).toBe(false);
    expect(isPlainObject(true)).toBe(false);
  });
});

describe("mergeAgentConfig", () => {
  it("deve fazer merge preservando defaults quando não há sobreposição", () => {
    const defaultConfig: AgentConfig = {
      description: "Default description",
      mode: "primary",
      color: "#ff0000",
    };

    const existingConfig: AgentConfig = {};

    const result = mergeAgentConfig(defaultConfig, existingConfig);

    expect(result.description).toBe("Default description");
    expect(result.mode).toBe("primary");
    expect(result.color).toBe("#ff0000");
  });

  it("deve sobrescrever valores primitivos com valores existentes", () => {
    const defaultConfig: AgentConfig = {
      description: "Default description",
      mode: "primary",
      color: "#ff0000",
    };

    const existingConfig: AgentConfig = {
      description: "Custom description",
      color: "#00ff00",
    };

    const result = mergeAgentConfig(defaultConfig, existingConfig);

    expect(result.description).toBe("Custom description");
    expect(result.mode).toBe("primary"); // Mantém default
    expect(result.color).toBe("#00ff00");
  });

  it("deve fazer merge profundo de objetos aninhados", () => {
    const defaultConfig: AgentConfig = {
      description: "Default",
      permission: {
        question: "allow",
      },
    };

    const existingConfig: AgentConfig = {
      permission: {
        question: "deny",
      },
    };

    const result = mergeAgentConfig(defaultConfig, existingConfig);

    expect(result.permission).toEqual({ question: "deny" });
  });

  it("deve preservar propriedades extras não definidas no default", () => {
    const defaultConfig: AgentConfig = {
      description: "Default",
    };

    const existingConfig: AgentConfig = {
      customProp: "custom value",
    };

    const result = mergeAgentConfig(defaultConfig, existingConfig);

    expect(result.description).toBe("Default");
    expect(result.customProp).toBe("custom value");
  });
});

describe("applyAgentAndCommands", () => {
  it("deve registrar agente e comandos em uma config vazia", () => {
    const config: MutableConfig = {};

    const agentConfig: AgentConfig = {
      description: "Test agent",
      mode: "primary",
    };

    const commands = {
      test: {
        description: "Test command",
        agent: "test",
        template: "Test: $ARGUMENTS",
      },
    };

    applyAgentAndCommands(config, "test", agentConfig, commands);

    expect(config.agent).toBeDefined();
    expect(config.agent?.test).toBeDefined();
    expect(config.agent?.test?.description).toBe("Test agent");

    expect(config.command).toBeDefined();
    expect(config.command?.test).toBeDefined();
    expect(config.command?.test?.description).toBe("Test command");
  });

  it("deve fazer merge com agente existente", () => {
    const config: MutableConfig = {
      agent: {
        test: {
          description: "Existing description",
          customProp: "existing value",
        },
      },
    };

    const agentConfig: AgentConfig = {
      description: "New description",
      mode: "primary",
    };

    applyAgentAndCommands(config, "test", agentConfig, {});

    expect(config.agent?.test?.description).toBe("Existing description"); // Preserva existente
    expect(config.agent?.test?.mode).toBe("primary"); // Adiciona novo
    expect(config.agent?.test?.customProp).toBe("existing value"); // Preserva custom
  });

  it("não deve sobrescrever comandos existentes", () => {
    const config: MutableConfig = {
      command: {
        test: {
          description: "Existing command",
          agent: "test",
          template: "Existing: $ARGUMENTS",
        },
      },
    };

    const commands = {
      test: {
        description: "New command",
        agent: "test",
        template: "New: $ARGUMENTS",
      },
    };

    applyAgentAndCommands(config, "test", {}, commands);

    // Comando existente deve ser preservado
    expect(config.command?.test?.description).toBe("Existing command");
    expect(config.command?.test?.template).toBe("Existing: $ARGUMENTS");
  });
});
