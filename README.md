<div align="center">

![opencode-huge-agents](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXo3bjliZTFlOTZ4djVyOHo5YTQ5MGUwb3hzNm1uNncxeHltMTU2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mOeOGNJ9I3zfsZAmZS/giphy.gif)

</div>

```
$ opencode agent list
  → ask          ──────── read-only code answers
  → solver       ──────── strategy-first planning
  → orchestrate  ──────── plan first, apply after approval
```

## $ ./overview.sh

```
┌─────────────┬──────────────────────┬─────────────────────┬────────────────────────┐
│ AGENT       │ PURPOSE              │ EDITING BEHAVIOR    │ BEST FOR               │
├─────────────┼──────────────────────┼─────────────────────┼────────────────────────┤
│ ask         │ Explain the code     │ Read-only (never)   │ Understanding code     │
│ solver      │ Compare approaches   │ Read-only (never)   │ Clarifying strategy    │
│ orchestrate │ Plan then apply      │ After approval      │ Guided implementation  │
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

**Update to the newest plugin version:**

```bash
$ npx opencode-huge-agents autoupdate
# or
$ bunx opencode-huge-agents autoupdate
```

**Verify installation:**

```bash
$ opencode agent list
  ✓ ask (primary)
  ✓ solver (primary)
  ✓ orchestrate (primary)
```

## $ ./usage.sh

```bash
# Tab completion to select agent
$ opencode [TAB]
  → ask
  → solver
  → orchestrate

# Direct invocation via slash commands
$ /ask <question>
$ /solver <request>
$ /orchestrate <task>
```

---

```
╔══════════════════════════════════════════════════════════╗
║  ASK AGENT                                               ║
║  Read-only answers about the code                        ║
╚══════════════════════════════════════════════════════════╝
```

### Command

```bash
$ /ask <question>    # Objective technical answer with evidence (never edits)
```

### What Ask Does

```
✓ Explores and analyzes code
✓ Prioritizes objective, concise answers by default
✓ Returns direct answer + code evidence (file:line)
✓ Expands only when the user asks for deeper detail
✓ Explains architecture, flows, and dependencies when needed
✗ NEVER edits files
✗ NEVER produces implementation plans by default
→ If implementation is requested, recommends switching modes
```

### Examples

```bash
$ /ask How does authentication work in this app?
$ /ask Where is the user validation logic?
$ /ask Explain the data flow in the checkout process
```

**Use ask when:** You need to understand code without making changes.

---

```
╔══════════════════════════════════════════════════════════╗
║  SOLVER AGENT                                            ║
║  Better planning with strategy comparison                ║
╚══════════════════════════════════════════════════════════╝
```

### Commands

```bash
$ /solver <request>    # Build a plan and compare strategies without editing
```

### Workflow

```
[1] Understand the real goal
     ↓
[2] Rewrite it as a clear problem statement
     ↓
[3] Compare 1-3 viable strategies when useful
     ↓
[4] Recommend the simplest good approach
     ↓
[5] Produce a concise implementation plan
```

### Examples

```bash
$ /solver build a dashboard for customer health
$ /solver create an onboarding flow for new users
$ /solver add exports to the analytics page
$ /solver improve search accuracy without slowing down the page
```

### Solver Output

```
1. Goal
2. Scope
3. Strategies
4. Recommendation
5. Open questions if needed
6. Implementation plan
7. Risks or assumptions when relevant
```

**Use solver when:** The request is ambiguous, there are multiple ways to solve it, or you want a stronger plan before coding.

---

```
╔══════════════════════════════════════════════════════════╗
║  ORCHESTRATE AGENT                                       ║
║  Solver-first planning with approval before apply        ║
╚══════════════════════════════════════════════════════════╝
```

### Commands

```bash
$ /orchestrate <task>    # Plan first, ask whether to apply it, then implement
```

### How Orchestrate Works

```
┌──────────────────────────┐
│ Read-only investigation  │
└────────────┬─────────────┘
             │
  ┌──────────▼──────────┐
  │ Use Solver thinking │
  │ to compare options  │
  └──────────┬──────────┘
             │
  ┌──────────▼──────────┐
  │ Recommend one path  │
  │ + build the plan    │
  └──────────┬──────────┘
             │
  ┌──────────▼──────────┐
  │ Ask for approval    │
  │ → apply it          │
  │ → revise the plan   │
  │ → ask questions     │
  │ → cancel            │
  └──────────┬──────────┘
             │
   doubts or revisions?
             │
         yes ─┴─ no
             │
      answer and refine
             │
      ask for approval again
             │
   user chooses apply it
             │
  ┌──────────▼──────────┐
  │ Execute + validate  │
  └─────────────────────┘
```

### Web Development Rules

When working with **React/Next.js/HTML/CSS/UI**, orchestrate automatically applies:

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

### Approval Options

At the end of the planning phase, orchestrate asks the user what to do next:

- apply it
- revise the plan
- ask focused questions about the project
- cancel

If the user still has doubts, orchestrate keeps answering and refining the plan, then asks again whether to `apply it`.

### Examples

```bash
$ /orchestrate Add error handling to the login function
$ /orchestrate Fix typos in config and update button text
$ /orchestrate Implement API caching with cache invalidation
$ /orchestrate Refactor authentication flow with rollback plan
```

**Use orchestrate when:** You want a real implementation plan first, then a direct approval step before changes are applied.

---

## $ cat opencode.json

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-huge-agents@latest"],
  "agent": {
    "ask": {
      "color": "#ff8c42",
      "permission": {
        "question": "allow"
      }
    },
    "solver": {
      "color": "#55f76dff",
      "permission": {
        "question": "allow"
      }
    },
    "orchestrate": {
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
│ ask         │ Never    │ N/A      │ Technical Q&A           │
│ solver      │ Never    │ Always   │ Strategy-first planning │
│ orchestrate │ After OK │ First    │ Guided execution        │
└─────────────┴──────────┴──────────┴─────────────────────────┘
```

## $ ./uninstall.sh

```bash
$ npx opencode-huge-agents uninstall
# or
$ bunx opencode-huge-agents uninstall
```

## $ ./autoupdate.sh

```bash
$ npx opencode-huge-agents autoupdate
# or
$ bunx opencode-huge-agents autoupdate
```

This runs `opencode plugin opencode-huge-agents@latest --global --force` to refresh the installed plugin and its cache.

---

## $ make build

```bash
$ git clone <repository>
$ cd opencode-huge-agents
$ npm install
$ npm run build
```

## $ ./architecture.sh

Starting from version **0.4.0**, the project uses a **persona-based architecture**:

```
src/
├── agents/
│   ├── shared/                # Shared infrastructure
│   │   ├── types.ts          # Common interfaces (AgentConfig, Persona, etc.)
│   │   └── configMerger.ts   # Shared utilities (merge, apply)
│   ├── ask/
│   │   └── askConfig.ts      # Imports askPersona
│   ├── personas/
│   │   ├── askPersona.ts
│   │   ├── orchestratePersona.ts
│   │   └── solverPersona.ts
│   ├── orchestrate/
│   │   └── orchestrateConfig.ts # Imports orchestratePersona
│   └── solver/
│       └── solverConfig.ts   # Imports solverPersona
└── index.ts                  # Plugin entry point
```

**Benefits:**
- DRY: No duplicated helper functions
- Centralized prompt management in `personas/`
- Easy to add new personas
- Better testability

**Current Commands:** `/ask`, `/solver`, and `/orchestrate` are registered on install. Use `opencode-huge-agents autoupdate` to refresh to the newest published plugin version.

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
