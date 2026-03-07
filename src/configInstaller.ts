import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { applyEdits, modify, parse, printParseErrorCode } from "jsonc-parser";

const DEFAULT_SCHEMA_URL = "https://opencode.ai/config.json";
const DEFAULT_PLUGIN_SPEC = "opencode-huge-agents@latest";
const DEFAULT_PLUGIN_NAME = "opencode-huge-agents";
const DEFAULT_CONFIG_FILE_NAME = "opencode.json";
const DEFAULT_CONFIG_DIRECTORY_NAME = "opencode";
const LEGACY_CONFIG_PATH = path.join(
  os.homedir(),
  ".config",
  DEFAULT_CONFIG_DIRECTORY_NAME,
  DEFAULT_CONFIG_FILE_NAME,
);

const JSON_FORMAT = {
  insertSpaces: true,
  tabSize: 2,
  eol: "\n",
};

export interface InstallOptions {
  pluginSpec?: string;
  configPath?: string;
}

export interface UninstallOptions {
  pluginName?: string;
  configPath?: string;
}

export interface ConfigMutationResult {
  configPath: string;
  changed: boolean;
  plugins: string[];
}

export function resolveConfigPath(configPath?: string): string {
  const providedConfigPath = configPath?.trim();
  if (providedConfigPath) {
    return providedConfigPath;
  }

  if (configPath !== undefined) {
    throw new Error("Invalid config path.");
  }

  const xdgConfigHome = process.env.XDG_CONFIG_HOME?.trim();
  if (xdgConfigHome) {
    return path.join(
      xdgConfigHome,
      DEFAULT_CONFIG_DIRECTORY_NAME,
      DEFAULT_CONFIG_FILE_NAME,
    );
  }

  if (fs.existsSync(LEGACY_CONFIG_PATH)) {
    return LEGACY_CONFIG_PATH;
  }

  if (process.platform === "darwin") {
    return path.join(
      os.homedir(),
      "Library",
      "Application Support",
      DEFAULT_CONFIG_DIRECTORY_NAME,
      DEFAULT_CONFIG_FILE_NAME,
    );
  }

  if (process.platform === "win32") {
    const appDataPath = process.env.APPDATA?.trim();
    if (appDataPath) {
      return path.join(
        appDataPath,
        DEFAULT_CONFIG_DIRECTORY_NAME,
        DEFAULT_CONFIG_FILE_NAME,
      );
    }
  }

  return LEGACY_CONFIG_PATH;
}

export function normalizePackageName(spec: string): string {
  const trimmed = spec.trim();

  if (trimmed.startsWith("@")) {
    const slashIndex = trimmed.indexOf("/");
    if (slashIndex < 0) {
      return trimmed;
    }

    const versionIndex = trimmed.indexOf("@", slashIndex + 1);
    return versionIndex < 0 ? trimmed : trimmed.slice(0, versionIndex);
  }

  const versionIndex = trimmed.indexOf("@");
  return versionIndex < 0 ? trimmed : trimmed.slice(0, versionIndex);
}

function readConfigText(configPath: string): string {
  if (!fs.existsSync(configPath)) {
    return "";
  }

  return fs.readFileSync(configPath, "utf8");
}

function getLineAndColumn(
  content: string,
  offset: number,
): { line: number; column: number } {
  const boundedOffset = Math.max(0, Math.min(offset, content.length));
  let line = 1;
  let column = 1;

  for (let index = 0; index < boundedOffset; index += 1) {
    if (content.charCodeAt(index) === 10) {
      line += 1;
      column = 1;
      continue;
    }

    column += 1;
  }

  return { line, column };
}

function parseConfig(text: string, configPath: string): Record<string, unknown> {
  if (!text.trim()) {
    return {};
  }

  const errors: {
    error: Parameters<typeof printParseErrorCode>[0];
    offset: number;
    length: number;
  }[] = [];
  const parsed = parse(text, errors, { allowTrailingComma: true, disallowComments: false });

  if (errors.length > 0) {
    const firstError = errors[0];
    const location = getLineAndColumn(text, firstError.offset);
    const errorCode = printParseErrorCode(firstError.error);
    throw new Error(
      `Could not parse config file at ${configPath} (line ${location.line}, column ${location.column}, code ${errorCode}).`,
    );
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Config at ${configPath} must be a JSON object.`);
  }

  return parsed as Record<string, unknown>;
}

function getPluginEntries(config: Record<string, unknown>, configPath: string): string[] {
  if (config.plugin === undefined) {
    return [];
  }

  if (!Array.isArray(config.plugin)) {
    throw new Error(`Config field 'plugin' must be an array in ${configPath}.`);
  }

  return config.plugin.map((entry) => String(entry));
}

function ensureParentDirectory(configPath: string): void {
  const parent = path.dirname(configPath);
  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent, { recursive: true });
  }
}

function applyModify(content: string, jsonPath: (string | number)[], value: unknown): string {
  const edits = modify(content, jsonPath, value, {
    formattingOptions: JSON_FORMAT,
    getInsertionIndex: undefined,
    isArrayInsertion: false,
  });

  if (edits.length === 0) {
    return content;
  }

  return applyEdits(content, edits);
}

function updatePluginList(plugins: string[], pluginSpec: string): { plugins: string[]; changed: boolean } {
  const requestedName = normalizePackageName(pluginSpec);
  const next = [...plugins];
  const existingIndex = next.findIndex(
    (entry) => normalizePackageName(String(entry)) === requestedName,
  );

  if (existingIndex < 0) {
    next.push(pluginSpec);
    return { plugins: next, changed: true };
  }

  if (next[existingIndex] === pluginSpec) {
    return { plugins: next, changed: false };
  }

  next[existingIndex] = pluginSpec;
  return { plugins: next, changed: true };
}

function removeFromPluginList(plugins: string[], pluginName: string): { plugins: string[]; changed: boolean } {
  const normalizedName = normalizePackageName(pluginName);
  const next = plugins.filter(
    (entry) => normalizePackageName(String(entry)) !== normalizedName,
  );

  return { plugins: next, changed: next.length !== plugins.length };
}

function writeConfig(configPath: string, content: string): void {
  ensureParentDirectory(configPath);
  const finalContent = content.endsWith("\n") ? content : `${content}\n`;
  const directoryPath = path.dirname(configPath);
  const tempFilePath = path.join(
    directoryPath,
    `${path.basename(configPath)}.${process.pid}.${Date.now()}.tmp`,
  );

  fs.writeFileSync(tempFilePath, finalContent, "utf8");

  try {
    fs.renameSync(tempFilePath, configPath);
  } catch (error) {
    if (fs.existsSync(tempFilePath)) {
      fs.rmSync(tempFilePath);
    }

    throw error;
  }
}

export function installPluginGlobally(options: InstallOptions = {}): ConfigMutationResult {
  const pluginSpec = (options.pluginSpec ?? DEFAULT_PLUGIN_SPEC).trim();
  if (!pluginSpec) {
    throw new Error("Invalid plugin spec.");
  }

  const configPath = resolveConfigPath(options.configPath);
  const content = readConfigText(configPath);
  const config = parseConfig(content, configPath);
  const currentPlugins = getPluginEntries(config, configPath);

  const pluginUpdate = updatePluginList(currentPlugins, pluginSpec);
  let nextContent = content.trim() ? content : "{}\n";

  if (!config.$schema) {
    nextContent = applyModify(nextContent, ["$schema"], DEFAULT_SCHEMA_URL);
  }

  nextContent = applyModify(nextContent, ["plugin"], pluginUpdate.plugins);

  const changed = content.trimEnd() !== nextContent.trimEnd();

  if (changed) {
    writeConfig(configPath, nextContent);
  }

  return {
    configPath,
    changed,
    plugins: pluginUpdate.plugins,
  };
}

export function uninstallPluginGlobally(options: UninstallOptions = {}): ConfigMutationResult {
  const pluginName = (options.pluginName ?? DEFAULT_PLUGIN_NAME).trim();
  if (!pluginName) {
    throw new Error("Invalid plugin name.");
  }

  const configPath = resolveConfigPath(options.configPath);
  const content = readConfigText(configPath);

  if (!content.trim()) {
    return {
      configPath,
      changed: false,
      plugins: [],
    };
  }

  const config = parseConfig(content, configPath);
  const currentPlugins = getPluginEntries(config, configPath);

  const pluginUpdate = removeFromPluginList(currentPlugins, pluginName);
  if (!pluginUpdate.changed) {
    return {
      configPath,
      changed: false,
      plugins: currentPlugins,
    };
  }

  let nextContent = applyModify(content, ["plugin"], pluginUpdate.plugins);
  if (!config.$schema) {
    nextContent = applyModify(nextContent, ["$schema"], DEFAULT_SCHEMA_URL);
  }

  writeConfig(configPath, nextContent);

  return {
    configPath,
    changed: true,
    plugins: pluginUpdate.plugins,
  };
}
