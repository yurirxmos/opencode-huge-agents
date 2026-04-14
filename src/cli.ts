#!/usr/bin/env node

import {
  installPluginGlobally,
  uninstallPluginGlobally,
} from "./configInstaller.js";

const HELP_TEXT = `opencode-huge-agents

Multi-agent plugin for OpenCode with 3 specialized agents:
  - huge-plan: Build-focused planning that sharpens rough requests
  - ask: Read-only technical advisor for code questions
  - exec: Planning-first executor with an approval menu

Usage:
  opencode-huge-agents install [plugin-spec] [--config /path/to/opencode.json]
  opencode-huge-agents uninstall [plugin-name] [--config /path/to/opencode.json]

Examples:
  opencode-huge-agents install
  opencode-huge-agents install opencode-huge-agents@latest
  opencode-huge-agents uninstall
  opencode-huge-agents uninstall opencode-huge-agents

After installation:
  - Tab completion: Select huge-plan, ask, or exec as primary agent
  - Commands: /huge-plan, /ask, /exec
  - Run: opencode agent list
`;

interface ParsedArgs {
  command: "install" | "uninstall" | "help";
  target?: string;
  configPath?: string;
}

interface ParsedConfigOption {
  configPath: string;
  consumedArguments: number;
}

function parseConfigOption(rest: string[], index: number): ParsedConfigOption | null {
  const argument = rest[index];

  if (argument === "--config") {
    const value = rest[index + 1];
    if (!value) {
      throw new Error("Missing value for --config");
    }

    return {
      configPath: value,
      consumedArguments: 2,
    };
  }

  if (argument.startsWith("--config=")) {
    const value = argument.slice("--config=".length);
    if (!value) {
      throw new Error("Missing value for --config");
    }

    return {
      configPath: value,
      consumedArguments: 1,
    };
  }

  return null;
}

function parseArgs(argv: string[]): ParsedArgs {
  if (argv.length === 0 || argv[0] === "-h" || argv[0] === "--help" || argv[0] === "help") {
    return { command: "help" };
  }

  const [command, ...rest] = argv;
  if (command !== "install" && command !== "uninstall") {
    throw new Error(`Unknown command: ${command}`);
  }

  let target: string | undefined;
  let configPath: string | undefined;

  for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];
    const configOption = parseConfigOption(rest, index);
    if (configOption) {
      if (configPath) {
        throw new Error("Duplicate --config argument");
      }

      configPath = configOption.configPath;
      index += configOption.consumedArguments - 1;
      continue;
    }

    if (argument.startsWith("--")) {
      throw new Error(`Unknown option: ${argument}`);
    }

    if (!target) {
      target = argument;
      continue;
    }

    throw new Error(`Unexpected argument: ${argument}`);
  }

  return {
    command,
    target,
    configPath,
  };
}

function run(): number {
  try {
    const parsed = parseArgs(process.argv.slice(2));

    if (parsed.command === "help") {
      console.log(HELP_TEXT);
      return 0;
    }

    if (parsed.command === "install") {
      const result = installPluginGlobally({
        pluginSpec: parsed.target,
        configPath: parsed.configPath,
      });

      console.log(`Plugin installed in ${result.configPath}`);
      console.log("Restart OpenCode and run: opencode agent list");
      return 0;
    }

    const result = uninstallPluginGlobally({
      pluginName: parsed.target,
      configPath: parsed.configPath,
    });

    if (!result.changed) {
      console.log("Plugin was not installed.");
      return 0;
    }

    console.log(`Plugin removed from ${result.configPath}`);
    console.log("Restart OpenCode and run: opencode agent list");
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error(message);
    console.error("Use --help to see available commands.");
    return 1;
  }
}

process.exit(run());
