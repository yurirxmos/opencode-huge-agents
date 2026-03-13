<div align="center">

![opencode-huge-agents](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXo3bjliZTFlOTZ4djVyOHo5YTQ5MGUwb3hzNm1uNncxeHltMTU2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mOeOGNJ9I3zfsZAmZS/giphy.gif)

</div>

```
$ opencode agent list
  → refactor ──────────── safe, review-first refactoring
  → ask      ──────────── read-only technical advisor
  → exec     ──────────── direct executor with web interface guidelines
```

## $ ./overview.sh

```
┌─────────────┬──────────────────────┬─────────────────────┬────────────────────────┐
│ AGENT       │ PURPOSE              │ EDITING BEHAVIOR    │ BEST FOR               │
├─────────────┼──────────────────────┼─────────────────────┼────────────────────────┤
│ refactor    │ Improve code quality │ After review        │ Safe refactoring       │
│ ask         │ Technical advisor    │ Read-only (never)   │ Understanding code     │
│ exec        │ Direct executor      │ Adaptive by risk    │ End-to-end delivery    │
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
$ /ask <question>              # Objective technical answer with evidence (never edits)
```

### What Ask Does

```
✓ Explores and analyzes code
✓ Prioritizes objective, concise answers by default
✓ Returns direct answer + code evidence (file:line)
✓ Expands only when user explicitly asks for deeper detail
✓ Explains architecture, flows, and dependencies when needed
✓ Answers "how" and "why" questions with verified references
✗ NEVER edits files
✗ NEVER proposes implementation plans or task breakdowns
→ If action is requested, recommends switching to planning/execution mode
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
║  Direct executor focused on delivery                     ║
╚══════════════════════════════════════════════════════════╝
```

### Commands

```bash
$ /exec <task>                 # Auto-select mode based on risk/impact
$ /exec-fast <task>            # Execute directly for low-risk tasks
$ /exec-balanced <task>        # Plan then execute for medium-risk work
$ /exec-safe <task>            # Risk-first strategy for critical tasks
```

### How Exec Works

```
┌──────────────────────────┐
│ Choose mode by risk      │
└────────────┬─────────────┘
             │
     ┌───────┼────────┐
     │       │        │
  ┌──▼──┐ ┌─▼───┐ ┌──▼──┐
  │FAST │ │BALAN│ │SAFE │
  │     │ │ CED │ │     │
  └──┬──┘ └──┬──┘ └──┬──┘
     │       │       │
     │  TodoWrite    │
     │  + confirm    │
     │       │       │
     └───────┴───────┘
             │
  ┌──────────▼──────────┐
  │ Execute + validate  │
  └──────────┬──────────┘
             │
  ┌──────────▼──────────┐
  │ "Vou fazer X com Y" │
  │ → Execute           │
  │ → Done ✓            │
  │ → Risks (if any)    │
  └─────────────────────┘
```

**Fast mode** (executes immediately):
- 1-2 files, isolated changes, easily reversible
- Example: `"fix typo in config"`

**Balanced mode** (creates plan first):
- Multiple files, interconnected changes, medium risk
- Example: `"add API caching + invalidation"`

**Safe mode** (risk-first execution):
- High risk, critical paths, low reversibility
- Example: `"migrate authentication flow"`

### Web Development Rules

When working with **React/Next.js/HTML/CSS/UI**, exec automatically applies:

**Accessibility:**
- Icon buttons need `aria-label`
- Form controls need `<label>` or `aria-label`
- Use `<button>` for actions, `<a>/<Link>` for navigation
- Interactive elements need visible focus states
- Never `outline-none` without replacement

**Forms:**
- Inputs need `autocomplete` + meaningful `name` + correct `type`
- Never block paste
- Submit button enabled until request starts
- Errors inline next to fields

**Performance:**
- Large lists (>50 items): virtualize
- `<img>` needs explicit `width`/`height`
- No layout reads in render (`getBoundingClientRect`, etc.)

**Anti-patterns flagged:**
- `transition: all`
- `<div onClick>` instead of `<button>`
- Images without dimensions
- Form inputs without labels
- `autoFocus` without justification

### Examples

```bash
$ /exec Add error handling to the login function
$ /exec-fast Fix typos in config and update button text
$ /exec-balanced Implement API caching with cache invalidation
$ /exec-safe Refactor authentication flow with rollback plan
```

**Use exec when:** You need direct execution with clear strategy and validation.

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
