<div align="center">

![opencode-huge-agents](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXo3bjliZTFlOTZ4djVyOHo5YTQ5MGUwb3hzNm1uNncxeHltMTU2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mOeOGNJ9I3zfsZAmZS/giphy.gif)

</div>

```
$ opencode agent list
  → huge-plan ─────────── build-focused planning
  → ask      ──────────── read-only technical advisor
  → exec     ──────────── planning-first executor with approval menu
```

## $ ./overview.sh

```
┌─────────────┬──────────────────────┬─────────────────────┬────────────────────────┐
│ AGENT       │ PURPOSE              │ EDITING BEHAVIOR    │ BEST FOR               │
├─────────────┼──────────────────────┼─────────────────────┼────────────────────────┤
│ huge-plan   │ Define what to build │ Read-only (never)   │ Clarifying scope       │
│ ask         │ Technical advisor    │ Read-only (never)   │ Understanding code     │
│ exec        │ Plan then execute    │ After approval      │ Guided delivery        │
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
  ✓ huge-plan (primary)
  ✓ ask (primary)
  ✓ exec (primary)
```

## $ ./usage.sh

```bash
# Tab completion to select agent
$ opencode [TAB]
  → huge-plan
  → ask
  → exec

# Direct invocation via slash commands
$ /huge-plan <request>
$ /ask <question>
$ /exec <task>
```

---

```
╔══════════════════════════════════════════════════════════╗
║  HUGE-PLAN AGENT                                         ║
║  Clarify goals before building                           ║
╚══════════════════════════════════════════════════════════╝
```

### Commands

```bash
$ /huge-plan <request>    # Build-focused planning workflow
```

### Workflow

```
[1] Understand desired outcome
     ↓
[2] Rewrite as clear build goal
     ↓
[3] Ask only high-impact questions
     ↓
[4] Produce concise implementation plan
     ↓
[5] Hand off to /exec
```

### Examples

```bash
$ /huge-plan build a dashboard for customer health
$ /huge-plan create an onboarding flow for new users
$ /huge-plan add exports to the analytics page
```

**Use huge-plan when:** You have a rough idea and want a clear, build-focused plan before implementation.

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
║  Planning-first executor with approval menu             ║
╚══════════════════════════════════════════════════════════╝
```

### Commands

```bash
$ /exec <task>    # Plan first, keep clarifying, then execute on implement now
```

### How Exec Works

```
┌──────────────────────────┐
│ Read-only investigation  │
└────────────┬─────────────┘
             │
  ┌──────────▼──────────┐
  │ Build concise plan  │
  └──────────┬──────────┘
             │
  ┌──────────▼──────────┐
  │ Ask focused doubts  │
  │ if needed           │
  └──────────┬──────────┘
             │
  ┌──────────▼──────────┐
  │ Interactive menu    │
  │ → implement now     │
  │ → ask questions     │
  │ → revise the plan   │
  │ → cancel            │
  └──────────┬──────────┘
             │
   doubts or revisions?
             │
        yes ─┴─ no
             │
     answer and refine
             │
        show menu again
             │
  user chooses implement now
             │
  ┌──────────▼──────────┐
  │ Execute + validate  │
  └─────────────────────┘
```

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

### Menu Options

At the end of the planning phase, exec asks the user what to do next:

- implement now
- ask focused questions about the project
- revise the plan
- cancel

If the user still has doubts, exec keeps answering and refining the plan, then shows the same menu again with `implement now`.

### Examples

```bash
$ /exec Add error handling to the login function
$ /exec Fix typos in config and update button text
$ /exec Implement API caching with cache invalidation
$ /exec Refactor authentication flow with rollback plan
```

**Use exec when:** You want implementation, but only after seeing a plan and approving it.

---

## $ cat opencode.json

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-huge-agents@latest"],
  "agent": {
    "huge-plan": {
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
│ huge-plan   │ Never    │ Always   │ Build clarification     │
│ ask         │ Never    │ N/A      │ Technical Q&A           │
│ exec        │ After OK │ First    │ Guided execution        │
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

## $ ./architecture.sh

Starting from version **0.4.0**, the project uses a **persona-based architecture**:

```
src/
├── agents/
│   ├── shared/                # Shared infrastructure
│   │   ├── types.ts          # Common interfaces (AgentConfig, Persona, etc.)
│   │   └── configMerger.ts   # Shared utilities (merge, apply)
│   ├── huge/
│   │   └── personas/         # Persona definitions
│   │       ├── askPersona.ts
│   │       ├── execPersona.ts
│   │       └── hugePlanPersona.ts
│   ├── ask/
│   │   └── askConfig.ts      # Imports askPersona
│   ├── exec/
│   │   └── execConfig.ts     # Imports execPersona
│   └── huge-plan/
│       └── hugePlanConfig.ts # Imports hugePlanPersona
└── index.ts                  # Plugin entry point
```

**Benefits:**
- DRY: No duplicated helper functions
- Centralized prompt management in `personas/`
- Easy to add new personas
- Better testability

**Current Commands:** `/ask`, `/exec`, and `/huge-plan` are registered on install. You can still switch between agents using Tab.

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
