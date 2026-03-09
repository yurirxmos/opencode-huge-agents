<div align="center">

![opencode-huge-agents](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXo3bjliZTFlOTZ4djVyOHo5YTQ5MGUwb3hzNm1uNncxeHltMTU2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mOeOGNJ9I3zfsZAmZS/giphy.gif)

</div>

```
$ opencode agent list
  → refactor ──────────── safe, review-first refactoring
  → ask      ──────────── read-only technical advisor
  → exec     ──────────── strategic orchestrator with adaptive execution modes
```

## $ ./overview.sh

```
┌─────────────┬──────────────────────┬─────────────────────┬────────────────────────┐
│ AGENT       │ PURPOSE              │ EDITING BEHAVIOR    │ BEST FOR               │
├─────────────┼──────────────────────┼─────────────────────┼────────────────────────┤
│ refactor    │ Improve code quality │ After review        │ Safe refactoring       │
│ ask         │ Technical advisor    │ Read-only (never)   │ Understanding code     │
│ exec        │ Orchestrate execution│ Adaptive by risk    │ End-to-end delivery    │
└─────────────┴──────────────────────┴─────────────────────┴────────────────────────┘
```

## $ ./install.sh

```bash
# Using npm
$ npm install opencode-huge-agents
$ npx opencode-huge-agents install

# Using Bun
$ bun add opencode-huge-agents
$ bunx opencode-huge-agents install
```

**Verify installation:**

```bash
$ opencode agent list
  ✓ refactor (primary)
  ✓ ask (primary)
  ✓ exec (primary)
```

## $ ./usage.sh

```bash
# Tab completion to select agent
$ opencode [TAB]
  → refactor
  → ask
  → exec

# Direct invocation via slash commands
$ /refactor <target>
$ /ask <question>
$ /exec <task>
$ /exec-fast <task>
$ /exec-balanced <task>
$ /exec-safe <task>
```

---

```
╔══════════════════════════════════════════════════════════╗
║  REFACTOR AGENT                                          ║
║  Safe, review-first refactoring                          ║
╚══════════════════════════════════════════════════════════╝
```

### Commands

```bash
$ /refactor                    # General refactoring (balanced)
$ /refactor-legibility         # Focus on readability
$ /refactor-performance        # Focus on optimization
$ /refactor-maintainability    # Focus on maintainability
```

### Workflow

```
[1] Analyze code
     ↓
[2] Propose improvements
     ↓
[3] Interactive menu:
     → Apply all safe refactors now
     → Apply only high-impact low-risk refactors
     → Select refactor variant
     → Show step-by-step plan
     → Ask questions before changes
     → Cancel
     ↓
[4] Execute (after confirmation)
     ↓
[5] Validate with tests
```

### Examples

```bash
$ /refactor src/services/user-service.ts
$ /refactor-performance the data processing pipeline
$ /refactor-legibility components/Dashboard.tsx
```

**Use refactor when:** You want to improve existing code quality safely without adding features.

---

```
╔══════════════════════════════════════════════════════════╗
║  ASK AGENT                                               ║
║  Read-only technical advisor                             ║
╚══════════════════════════════════════════════════════════╝
```

### Command

```bash
$ /ask <question>              # Ask technical questions (never edits)
```

### What Ask Does

```
✓ Explores and analyzes code
✓ Explains architecture and patterns
✓ Traces execution flows
✓ Identifies dependencies
✓ Answers "how" and "why" questions
✓ Starts with a direct answer, then code references (file:line)
✓ Adapts depth automatically (quick for simple, deep for architecture)
✗ NEVER edits files
```

### Examples

```bash
$ /ask How does authentication work in this app?
$ /ask Where is the user validation logic?
$ /ask Explain the data flow in the checkout process
$ /ask What patterns are used in the API layer?
$ /ask What are the dependencies of the UserService?
```

**Use ask when:** You need to understand code without making changes.

---

```
╔══════════════════════════════════════════════════════════╗
║  EXEC AGENT                                              ║
║  Strategic execution orchestrator                         ║
╚══════════════════════════════════════════════════════════╝
```

### Commands

```bash
$ /exec <task>                 # Auto-select mode by impact/risk/reversibility
$ /exec-fast <task>            # Prefer speed for low-risk reversible tasks
$ /exec-balanced <task>        # Plan then execute for medium-risk changes
$ /exec-safe <task>            # Risk-first for high-impact critical tasks
```

### How Exec Works

```
┌──────────────────────────────────┐
│ Assess impact, risk, reversibility │
└────────────────┬─────────────────┘
                 │
     ┌───────────┼───────────┐
     │           │           │
  ┌──▼───┐   ┌───▼────┐   ┌──▼───┐
  │ FAST │   │BALANCED│   │ SAFE │
  └──┬───┘   └───┬────┘   └──┬───┘
     │           │           │
     │      Plan + review    │
     │      (TodoWrite)      │
     │           │           │
     └───────────┴───────────┘
                 │
      ┌──────────▼──────────┐
      │ Execute + validate  │
      └──────────┬──────────┘
                 │
      ┌──────────▼──────────┐
      │ Delivery contract   │
      │ objective/mode/     │
      │ changes/validation/ │
      │ residual risks      │
      └─────────────────────┘
```

**Fast mode** (executes immediately):
- 1-2 files with clear changes
- Low risk and reversible
- Example: `"fix typo in config"`

**Balanced mode** (creates plan first):
- Interconnected changes with moderate risk
- Dependencies need coordination
- Example: `"add API caching + invalidation"`

**Safe mode** (risk-first execution):
- High-impact or hard-to-reverse changes
- Critical paths (auth, data, infra)
- Example: `"migrate authentication flow"`

### Examples

```bash
$ /exec Add error handling to the login function
$ /exec-fast Fix typos and small naming inconsistencies in config
$ /exec-balanced Implement API caching with cache invalidation rules
$ /exec-safe Refactor authentication flow with rollback strategy
```

**Use exec when:** You need end-to-end execution with strategy, validation, and clear risk handling.

---

## $ cat opencode.json

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

## $ diff built-in.txt huge-agents.txt

```
┌─────────────┬──────────┬──────────┬─────────────────────────┐
│ AGENT       │ EDITING  │ PLANNING │ USE CASE                │
├─────────────┼──────────┼──────────┼─────────────────────────┤
│ build       │ Immediate│ Manual   │ Quick features          │
│ plan        │ Ask first│ Always   │ Understanding & planning│
│ refactor    │ After rev│ Safety   │ Code quality            │
│ ask         │ Never    │ N/A      │ Technical Q&A           │
│ exec        │ Adaptive │ By risk  │ End-to-end execution    │
└─────────────┴──────────┴──────────┴─────────────────────────┘
```

## $ ./uninstall.sh

```bash
$ npx opencode-huge-agents uninstall
# or
$ bunx opencode-huge-agents uninstall
```

---

## $ make build

```bash
$ git clone <repository>
$ cd opencode-huge-agents
$ npm install
$ npm run build
```

---

## $ cat LICENSE

MIT

---

## $ ./contributing.md

Contributions welcome! Please submit issues or pull requests.

---

## $ ./support.md

- **GitHub Issues:** [Create an issue]
- **OpenCode Docs:** https://opencode.ai/docs
