# opencode-huge-agents

A multi-agent OpenCode plugin featuring three specialized agents for different workflows:
- **refactor** 🟢 - Safe, review-first refactoring
- **ask** 🟠 - Read-only technical advisor
- **exec** 🔴 - Smart executor with auto-planning

## Overview

This plugin adds three primary agents to OpenCode, each optimized for specific tasks:

| Agent | Color | Purpose | Editing Behavior | Best For |
|-------|-------|---------|------------------|----------|
| **refactor** | 🟢 Green | Improve code quality | After review & confirmation | Safe refactoring without changing features |
| **ask** | 🟠 Orange | Answer technical questions | Read-only (never edits) | Understanding code, architecture, and patterns |
| **exec** | 🔴 Red | Execute changes | Direct or planned execution | Implementing features and fixes |

## Installation

### Using npm

```bash
npm install opencode-huge-agents
npx opencode-huge-agents install
```

### Using Bun

```bash
bun add opencode-huge-agents
bunx opencode-huge-agents install
```

After installation, restart OpenCode and verify:

```bash
opencode agent list
```

You should see `refactor (primary)`, `ask (primary)`, and `exec (primary)` listed.

## Usage

### Selecting Agents

**Tab Completion**: Press Tab in OpenCode to select between refactor, ask, or exec as your primary agent.

**Slash Commands**: Use `/refactor`, `/ask`, or `/exec` to invoke specific agents directly.

---

## 🟢 Refactor Agent

Safe, review-first refactoring that improves code without changing functionality.

### Commands

- `/refactor` - General refactoring (balanced focus)
- `/refactor-legibility` - Focus on readability
- `/refactor-performance` - Focus on performance optimization
- `/refactor-maintainability` - Focus on maintainability

### Workflow

1. Agent analyzes your code
2. Proposes specific improvements
3. Presents interactive menu:
   - Apply all safe refactors now
   - Apply only high-impact low-risk refactors
   - Select refactor variant
   - Show step-by-step plan
   - Ask questions before changes
   - Cancel
4. Executes after confirmation
5. Validates with tests

### Examples

```
/refactor src/services/user-service.ts
/refactor-performance the data processing pipeline
/refactor-legibility components/Dashboard.tsx
```

**Use refactor when**: You want to improve existing code quality safely without adding features.

---

## 🟠 Ask Agent

Read-only technical advisor for code exploration and understanding.

### Command

- `/ask` - Ask technical questions (never edits files)

### What Ask Does

- ✅ Explores and analyzes code
- ✅ Explains architecture and patterns
- ✅ Traces execution flows
- ✅ Identifies dependencies
- ✅ Answers "how" and "why" questions
- ❌ **NEVER** edits files

### Examples

```
/ask How does authentication work in this app?
/ask Where is the user validation logic?
/ask Explain the data flow in the checkout process
/ask What patterns are used in the API layer?
/ask What are the dependencies of the UserService?
```

**Use ask when**: You need to understand code without making changes.

---

## 🔴 Exec Agent

Smart executor that plans complex tasks and executes simple ones directly.

### Command

- `/exec` - Execute changes (auto-decides if planning is needed)

### How Exec Works

Exec automatically assesses task complexity:

**Simple tasks** (executes immediately):
- 1-2 files with clear changes
- Straightforward logic
- Low risk
- Example: "fix typo in config"

**Complex tasks** (creates plan first):
- 3+ files or interconnected changes
- Architectural decisions required
- Unclear requirements
- High risk
- Example: "add authentication system"

### Workflow for Complex Tasks

1. Exec assesses complexity → determines planning is needed
2. Creates structured plan using TodoWrite
3. Presents plan for your review
4. Waits for confirmation
5. Executes step-by-step with progress updates

### Examples

```
/exec Add error handling to the login function
/exec Implement a caching layer for API responses
/exec Fix the TypeScript errors in the build
/exec Refactor the entire data layer (will auto-plan)
```

**Use exec when**: You want smart execution that adapts to task complexity.

---

## Configuration

The plugin auto-configures all three agents. To customize, edit your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-huge-agents@latest"],
  "agent": {
    "refactor": {
      "color": "#55f76dff",
      "permission": {
        "question": "allow"
      }
    },
    "ask": {
      "color": "#ff8c42",
      "permission": {
        "question": "allow"
      }
    },
    "exec": {
      "color": "#ff3b3b",
      "permission": {
        "question": "allow"
      }
    }
  }
}
```

## Comparison with Built-in Agents

| Agent | Editing | Planning | Use Case |
|-------|---------|----------|----------|
| **build** (built-in) | Immediate | Manual | Quick feature implementation |
| **plan** (built-in) | Ask first | Always | Understanding and planning |
| **refactor** 🟢 (huge-agents) | After review | Safety-focused | Code quality improvements |
| **ask** 🟠 (huge-agents) | Never | N/A | Technical Q&A |
| **exec** 🔴 (huge-agents) | Smart | Auto-decided | Adaptive execution |

## Uninstallation

```bash
npx opencode-huge-agents uninstall
# or
bunx opencode-huge-agents uninstall
```

## Development

Build from source:

```bash
git clone <repository>
cd opencode-huge-agents
npm install
npm run build
```

## License

MIT

## Contributing

Contributions welcome! Please submit issues or pull requests.

## Support

- GitHub Issues: [Create an issue]
- OpenCode Docs: https://opencode.ai/docs
