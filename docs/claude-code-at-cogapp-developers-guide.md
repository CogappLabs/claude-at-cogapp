# Claude Code at Cogapp: A Developer's Guide

A practical guide to getting started with Claude Code, what it can do, and how to use it well.

---

## What is Claude Code?

Claude Code is Anthropic's AI coding assistant. It runs in your terminal, desktop app, web browser, or IDE (VS Code, JetBrains) and has direct access to your project files, git history, and shell. It can read your codebase, edit files, run commands, connect to external tools (databases, browsers, project management) via MCP, and work across multiple files in a single conversation. It has a context window of 200k tokens, (up to 1 million on premium seats), so it can hold a lot of a project in memory at once.

It works well for tasks like debugging, refactoring across files, writing tests, and code review: things where you'd otherwise be jumping between files and docs yourself.

Ways to use it:

- **CLI**: run `claude` in your terminal inside a project directory  
- **Desktop app**: Mac and Windows
- **Web**: claude.ai/code
- **IDE extensions**: VS Code, JetBrains (opens as a panel)

All give you the same Claude under the hood. Run `/init` inside a project to generate a starter `CLAUDE.md`. More on that below.

---

## Key Concepts

### Models

Claude comes in different model sizes. The one you're using matters:

| Model | Best for | Speed | Cost |
| :---- | :---- | :---- | :---- |
| **Haiku** | Quick questions, simple edits, boilerplate | Fast | Cheap |
| **Sonnet** | Day-to-day coding, debugging, reviews | Good balance | Mid |
| **Opus** | Complex architecture, multi-file refactors, tricky bugs | Slower | Expensive |

You can switch models with `/model`. A good pattern: use Opus for up-front planning and architecture decisions, then switch to Sonnet for implementation. Sonnet is fine for most day-to-day work. Reach for Opus when you're stuck or need to reason through something complex.

### Context & Tokens

- **Context window** \= how much text Claude can "see" at once (think of it as working memory)  
- **Tokens** ≈ chunks of text (\~4 characters each). Code, file contents, and your messages all consume tokens  
- When context fills up, older parts of the conversation get compressed. This is normal  
- **Practical tip**: start a new conversation (`/clear`) when switching to a completely different task. Carrying old context wastes tokens and can confuse things

### Skills

Skills are reusable prompt templates that teach Claude how to do specific tasks. They trigger automatically when relevant, or you can invoke them manually with `/skill-name`. Examples: `/debug`, `/review`, `/test`.

We maintain our own skills at [cogapplabs/claude-plugins](https://github.com/cogapplabs/claude-plugins).

Anthropic's direction is increasingly towards skills over MCP servers. MCP provides the plumbing for connecting to external tools, but skills are becoming the primary way to encode workflows and domain knowledge. In practice, you'll interact with skills more often than MCP directly.

### MCP (Model Context Protocol)

MCP servers give Claude extra capabilities beyond files and shell. Think of them as plugins:

- **Database MCPs**: query databases directly  
- **Linear, Slack, etc.**: interact with external tools

These are configured per-project or globally. You'll see them if a project has them set up. You don't need to worry about configuring these yourself initially.

### Context7

[Context7](https://context7.com/) gives Claude access to up-to-date documentation for libraries and frameworks. It reduces hallucinated APIs and outdated patterns by pulling real docs at query time rather than relying on training data.

Install it as a Claude Code skill:

```shell
npx ctx7 setup --claude
```

When prompted, choose **CLI + Skills** (not MCP server). This installs a skill that tells Claude to fetch docs via `ctx7` CLI commands, which is the recommended path over the MCP server option.

---

## Configuring Claude

### CLAUDE.md

A markdown file that Claude reads automatically every conversation. Use it for project conventions, guardrails, and anything you'd otherwise repeat. Think of it as onboarding notes for Claude.

There are two levels:

- **Global** (`~/.claude/CLAUDE.md`): applies to all your projects. Good for personal standards and tool preferences  
- **Project** (`.claude/CLAUDE.md` in the repo): applies to everyone working on that project. Commit it to git

The better your `CLAUDE.md`, the less you need to repeat yourself. Here's an example of what a global `CLAUDE.md` might include:

```
# Package Management
- NEVER manually edit package.json or lock files
- ALWAYS use npm install / npm uninstall

# Code Execution
- NEVER start dev servers: I'll run these manually
- ALWAYS write test/exploration scripts to scripts/

# After Significant Work
- ALWAYS run linting and type checks after changes
- Fix any issues before considering work complete

# Git Commits
- NEVER add Co-Authored-By or AI attribution to commits
- Keep commit messages clean

# Hook Errors
- When a hook fires and reports errors, immediately
  fix the issues before continuing

# Technology Standards
- Python: uv, ruff, ty, Python 3.13+
- Frontend: TypeScript strict, Tailwind v4, Biome v2
- All projects: Lefthook for pre-commit, GitHub Actions CI

# Data Tools
- DuckDB CLI is available for ad-hoc data queries
- Supports CSV, JSON, Parquet, Excel, databases
```

The key is being explicit about what Claude should and shouldn't do. Without these rules, Claude will make its own decisions: sometimes sensible, sometimes not.

*The official docs say:*   
*\> Keep it concise. For each line, ask: “Would removing this cause Claude to make mistakes?” If not, cut it. Bloated CLAUDE.md files cause Claude to ignore your actual instructions\!*

Beyond `CLAUDE.md`, Claude Code has global settings (`~/.claude/settings.json`) for permissions, allowed tools, and other configuration. More information on recommended team-wide settings will be coming from Neil.

### Writing Your Own Skills

If you find yourself repeating the same instructions to Claude across conversations: "always use this commit format", "review code against these standards": that's a skill waiting to be written. It encodes team knowledge so Claude applies it consistently, without anyone having to remember the steps.

A skill is just a `SKILL.md` file with YAML frontmatter and markdown instructions:

```
---
name: collection-flow
description: >
  CollectionFlow ETL pipeline standards. Use when working
  with Dagster assets, Polars DataFrames, or Pandera schemas
  in collection-flow projects.
---

## Commandments

1. Always use Polars lazy API: call .lazy() on ingest,
   .collect() only at the end
2. One asset per function, one function per file
3. Validate with Pandera schemas at stage boundaries
4. Five pipeline stages: Extract → Parse → Transform → Join → Load

## Common Mistakes

- Calling .collect() mid-pipeline (kills performance)
- Putting transform logic in the extract stage
- Skipping schema validation between stages

For full reference, see [reference/pipeline-patterns.md](reference/pipeline-patterns.md)
```

Skills live at three levels:

| Scope | Path | Available to |
| :---- | :---- | :---- |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<name>/SKILL.md` | Anyone who clones the repo |
| Enterprise | Managed settings | Everyone in the org |

Tips for writing good skills:

- **Be concise**: Claude is already smart. Only add context it doesn't already have  
- **One level of references**: keep `SKILL.md` as a table of contents, link to reference files for heavy content, but don't nest references within references  
- **Test with different models**: what works with Opus might need more detail for Haiku  
- **Write descriptions that trigger well**: Claude uses the description to decide when to load the skill, so include what it does AND when to use it

See the official docs for the full picture:

- [Extend Claude with skills](https://code.claude.com/docs/en/skills)  
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

---

## What to Use It For

### Debugging & Triage

Paste an error message and point Claude at the relevant code.

```
"I'm getting this error when I run the tests: [paste error].
The relevant code is in src/utils/parser.ts. What's going on?"
```

For tricky bugs, give it more context: related files, what you've already tried, what you expected to happen.

### Reviewing Your Own Code

Before pushing, ask Claude to review your changes:

```
"Review my staged changes for bugs, edge cases, and anything I've missed"
```

It can see your git diff and will flag potential issues.

### Finding Edge Cases

```
"What edge cases am I missing in this validation function?"
"What happens if the API returns an empty array here?"
```

Useful for thinking through unhappy paths before they bite you in production.

### Writing & Running Tests

```
"Write tests for the UserProfile component covering the main user flows"
"Add a test for the case where the session has expired"
```

### Browser Automation

Claude can control a Chrome browser via the Claude in Chrome extension: clicking, typing, navigating, reading page content, and taking screenshots. Useful for verifying a dev server is rendering correctly, testing form flows, or reading console errors. It works with your actual browser session, so it can interact with authenticated pages you're already logged into.

### Other

- **Explaining unfamiliar code**: "Walk me through what this middleware does"  
- **Refactoring**: "Extract this into a reusable hook" / "Convert this to TypeScript"  
- **Git**: "Summarise the changes on this branch" / "Write a commit message for my staged changes"  
- **Boilerplate**: "Create a new API route for user preferences"

---

## Security & Safety

### Protect Secrets

- **Never paste API keys, passwords, or tokens** into a Claude conversation  
- **Block access to sensitive files**: Claude can read any file in your project by default, including `.env`. Use `/permissions` to add deny rules for files like `.env`, `.env.local`, `credentials.json`, and anything in `~/.ssh/`. This prevents Claude from reading them even accidentally  
- **Don't give blanket file access**: review permission prompts before accepting. If Claude asks to run something unexpected, say no and ask why  
- Code you send to Claude is processed by Anthropic's servers. They don't train on it, but it leaves your machine

### Permission Controls

- Claude asks permission before running shell commands or editing files  
- You can pre-approve safe commands (like `npm test`, `git status`) via `/permissions`  
- **Never approve commands you don't understand**: ask Claude to explain first  
- Be especially cautious with `curl`, `wget`, or anything that makes network requests

### Don't Trust Untrusted Repos

If you clone a repo you don't own and open Claude Code in it, be aware that malicious `CLAUDE.md` files or hook configurations could trick Claude into running harmful commands. Stick to repos you trust.

### General Mindset

- **Claude is a tool, not an authority**: always review its output before committing  
- **It can be confidently wrong**: especially about APIs, library versions, or project-specific conventions it hasn't been told about  
- **Smaller, focused requests work better** than "rewrite everything"  
- **If something feels off, stop and check**: you can always `/rewind` (or press Esc twice) to undo recent file changes

---

## Tips

1. **Be specific**: "Fix the bug" is vague. "The date picker shows the wrong month when you navigate backwards in Firefox" gives Claude something to work with  
2. **Give context**: point to the relevant files, paste the error, explain what you expected  
3. **Iterate**: if the first answer isn't right, say what's wrong rather than starting over  
4. **Use `/clear` between tasks**: fresh context \= better answers  
5. **Read what it writes**: Claude is a first draft, not a final submission. Review diffs before accepting  
6. **Start small**: try it on a bug fix or a test before asking it to architect a new feature

---

## Quick Reference

| Command | What it does |
| :---- | :---- |
| `/help` | Show available commands |
| `/clear` | Start a fresh conversation |
| `/model` | Switch Claude model |
| `/init` | Generate a CLAUDE.md for the project |
| `/permissions` | Manage allowed commands |
| `/rewind` (or Esc Esc) | Roll back file changes and/or conversation to an earlier point |
| `/compact` | Compress conversation to save context |
| `!command` | Run a shell command and share the output with Claude |

---

## Further Reading

- [Claude Code docs](https://docs.anthropic.com/en/docs/claude-code)  
- [CLAUDE.md best practices](https://docs.anthropic.com/en/docs/claude-code/memory)  
- [Security guidance](https://docs.anthropic.com/en/docs/claude-code/security)  
- [Extend Claude with skills](https://code.claude.com/docs/en/skills)  
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)  
- [Agent Skills: Equipping agents for the real world](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)  
- [Simon Willison: Claude Skills are awesome](https://simonwillison.net/2025/Oct/16/claude-skills/)  
- [Context7: up-to-date library docs for AI](https://context7.com/)  
- [Cogapp shared skills](https://github.com/cogapplabs/claude-plugins)

