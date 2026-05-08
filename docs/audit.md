# Slide deck audit (2026-05-08)

Holistic review of `slides/src/content/slides/` and companion guide `docs/claude-code-at-cogapp-developers-guide.md`.

## Findings

### Narrative flow

1. **Skills section muddled** — `memory.mdx` and `plan-mode.mdx` tagged `section: Skills` but neither is a skill. Re-section: memory → Config; plan-mode → Tips or own mini-section.
2. **Jarring Skills → Config pivot** — no bridge after `subagents.mdx`. Add a closing line.
3. **`cogapp-prompts-section` out of place** — sits between authoring and uses; really a subset of uses. Merge with `real-prompts` into uses block.
4. **`protect-secrets.mdx` permission-blocked from tooling** — manually verify content for duplication risk.

### Duplication / overlap

5. **`permissions.mdx` ↔ `permission-controls.mdx` near-total overlap.** Merge: keep JSON in Config, refer back briefly in Security.
6. **`bad-at.mdx` ↔ `failure-modes.mdx` thematic overlap.** Make distinction explicit in titles ("What it can't do" vs "How it fails").
7. **`mindset.mdx` ↔ `tips.mdx` overlapping advice.** Tip "smaller focused requests" duplicates "start small". Collapse.
8. **`untrusted-repos.mdx` ↔ `anti-patterns.mdx` warning duplicated.** Drop bullet from anti-patterns.
9. **`context-tokens.mdx` ↔ `clear-vs-compact.mdx`** — `/clear` rationale stated twice. Cut "Why /clear helps" from context-tokens.

### Gaps

10. **No output-styles / verbosity slide.** Add note in tips/mindset on `--output-format` or `output_style` CLAUDE.md option.
11. **No headless / CI / GitHub Actions slide.** Two-ways links headless docs but doesn't explain. Add bullets or dedicated slide after uses.
12. **No Agent SDK mention.** One bullet in uses or subagents flagging "build your own" path.
13. **`/init` mentioned but never explained.** Add gloss to day-one step 3: "generates starter CLAUDE.md from repo analysis".
14. **No mention of `--dangerously-skip-permissions` flag.** Caution note in permission-controls or anti-patterns.

### Accuracy

15. **`what-is.mdx` context window figure may be stale.** Verify "200k / 1M premium" framing for current Opus 4.7 plan tiers.
16. **`day-one.mdx` step 5 (`npx ctx7 setup --claude`) needs Node prerequisite.** Add "(requires Node/npx on PATH)".
17. **`subagent-routing.mdx` model directive ambiguous.** Where does `model: "haiku"` go? Clarify: "Add to global CLAUDE.md".
18. **`plan-mode.mdx` lists `ExitPlanMode` as an agent — it's a tool/command.** Fix.
19. **`memory.mdx` path may be Cogapp-custom not canonical.** Verify against docs; label as Cogapp conventions if not native.
20. **`quick-reference.mdx` lists `/plan` as native — it's a skill.** Split table: native commands vs Cogapp skills.
21. **`quick-reference.mdx` `/ultrareview` missing "(billed separately)" caveat.**

### Tone

22. **Mixed register** — slides swing between tweet-length terse and mini-article prose. Set rule: max 6 bullets or one code block per content slide; reserve kicker lines for moments that earn them.

### Length / density

23. **`context-tokens.mdx` too dense** — main + 4-bullet subsection that overlaps next slide.
24. **`skills.mdx` Skills-vs-MCP buried** — most important conceptual clarification in talk, currently below the fold. Promote to own slide.
25. **`mcp-roundup.mdx` bare 9-row table.** Add lead sentence + bold the 2-3 most-used (Linear, Slack, Context7).
26. **9 title-only section slides (19% of deck).** Add one-line "what you'll learn here" signpost to each.

### Companion doc alignment

27. **Doc missing: hooks, plan-mode, subagents, ultrareview, trust-ladder, cost-model.** Add a "Power features" section.
28. **Doc quick-reference omits `/plan` and `/ultrareview`.** Sync.
29. **Doc links use `docs.anthropic.com` (legacy); slides use `code.claude.com`.** Standardise on `code.claude.com`.
30. **Doc CLAUDE.md sample richer than slide sample.** Either add to slide or note "see guide for extended example".

## Top 5 priorities

1. Merge `permissions` ↔ `permission-controls` (finding 5)
2. Promote Skills-vs-MCP to own slide (finding 24)
3. Re-section memory/plan-mode out of Skills (findings 1+2)
4. Add signposts to 9 title-only section slides (finding 26)
5. Update companion doc to cover hooks/plan-mode/ultrareview/etc (finding 27)
