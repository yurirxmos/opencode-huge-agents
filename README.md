<div align="center">

![opencode-huge-agents](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXo3bjliZTFlOTZ4djVyOHo5YTQ5MGUwb3hzNm1uNncxeHltMTU2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mOeOGNJ9I3zfsZAmZS/giphy.gif)

</div>

```
$ opencode agent list
  → refactor [🟢] ──────────── safe, review-first refactoring
  → ask      [🟠] ──────────── read-only technical advisor  
  → exec     [🔴] ──────────── smart executor with auto-planning
```

## $ ./overview.sh

```
┌─────────────┬───────┬──────────────────────┬─────────────────────┬────────────────────────┐
│ AGENT       │ COLOR │ PURPOSE              │ EDITING BEHAVIOR    │ BEST FOR               │
├─────────────┼───────┼──────────────────────┼─────────────────────┼────────────────────────┤
│ refactor    │  🟢   │ Improve code quality │ After review        │ Safe refactoring       │
│ ask         │  🟠   │ Technical advisor    │ Read-only (never)   │ Understanding code     │
│ exec        │  🔴   │ Execute changes      │ Direct or planned   │ Feature implementation │
└─────────────┴───────┴──────────────────────┴─────────────────────┴────────────────────────┘
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
```

---

```
╔══════════════════════════════════════════════════════════╗
║  🟢 REFACTOR AGENT                                       ║
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
║  🟠 ASK AGENT                                            ║
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
║  🔴 EXEC AGENT                                           ║
║  Smart executor with auto-planning                       ║
╚══════════════════════════════════════════════════════════╝
```

### Command

```bash
$ /exec <task>                 # Execute (auto-decides if planning needed)
```

### How Exec Works

```
┌─────────────────────┐
│  TASK ASSESSMENT    │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼──┐      ┌───▼───┐
│SIMPLE│      │COMPLEX│
└───┬──┘      └───┬───┘
    │             │
    │         ┌───▼──────────┐
    │         │ Create Plan  │
    │         │ (TodoWrite)  │
    │         └───┬──────────┘
    │             │
    │         ┌───▼──────────┐
    │         │ User Review  │
    │         └───┬──────────┘
    │             │
    └─────┬───────┘
          │
    ┌─────▼──────┐
    │  EXECUTE   │
    └────────────┘
```

**Simple tasks** (executes immediately):
- 1-2 files with clear changes
- Straightforward logic
- Low risk
- Example: `"fix typo in config"`

**Complex tasks** (creates plan first):
- 3+ files or interconnected changes
- Architectural decisions required
- Unclear requirements
- High risk
- Example: `"add authentication system"`

### Examples

```bash
$ /exec Add error handling to the login function
$ /exec Implement a caching layer for API responses
$ /exec Fix the TypeScript errors in the build
$ /exec Refactor the entire data layer (will auto-plan)
```

**Use exec when:** You want smart execution that adapts to task complexity.

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
│ refactor 🟢 │ After rev│ Safety   │ Code quality            │
│ ask 🟠      │ Never    │ N/A      │ Technical Q&A           │
│ exec 🔴     │ Smart    │ Auto     │ Adaptive execution      │
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
