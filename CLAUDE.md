# CLAUDE.md

Instructions for Claude Code working in this repo.

## What this project is

A multi-agent system that researches, writes, builds, and reviews a **13-section landing page for an
AI consulting service**. The only conversion goal is a lead: the visitor fills out the contact form
or clicks the external form link. Read `system.md` first — it is the source of truth for the
pipeline, the 13-section structure, and the conversion rules.

## Repo layout

```
system.md                 System design: goal, pipeline, 13 sections, CRO rules, definition of done
CLAUDE.md                 This file
.claude/agents/           Subagent definitions (one per pipeline stage)
  researcher.md
  research-consolidator.md
  copywriter.md
  landing-page-builder.md
  cro-reviewer.md
inputs/                   (optional) your real data: brand name, case studies, testimonials, logos
docs/
  01-research.md          ← researcher
  02-brief.md             ← research-consolidator
  03-copy.md              ← copywriter
  04-cro-review.md        ← cro-reviewer
site/
  index.html              ← landing-page-builder
  styles.css
  app.js                  CONFIG: brand name, form endpoint, external form URL
```

## How to run the pipeline

Run the agents in order; each reads only the previous stage's file.

1. `Use the researcher agent` → `docs/01-research.md`
2. `Use the research-consolidator agent` → `docs/02-brief.md`
3. `Use the copywriter agent` → `docs/03-copy.md`
4. `Use the landing-page-builder agent` → `site/`
5. `Use the cro-reviewer agent` → `docs/04-cro-review.md`; if score < 85, send its fix list back to
   the copywriter (copy issues) or builder (UI issues) and re-review.

To change just one thing, re-run from the stage that owns it (e.g. new headline → copywriter, then builder).

## Rules

- **Follow `system.md` §3 (section order) and §4 (conversion principles).** Don't add a 14th section
  or a second conversion goal without the user asking.
- **Don't invent facts as real.** Client names, stats, and testimonials not supplied in `inputs/`
  are placeholders and must be wrapped/flagged with `<!-- PLACEHOLDER -->` in HTML and `[PLACEHOLDER]`
  in docs.
- **Copy lives in `docs/03-copy.md`.** If you change wording in `site/index.html`, update the copy doc too.
- **No build tooling.** Plain HTML/CSS/JS; keep the page dependency-free except Google Fonts.
- **Form config** lives only in `site/app.js` → `CONFIG`. Never hardcode endpoints elsewhere.
- Preview locally by opening `site/index.html` in a browser (or `npx serve site`).

## Before launch checklist (for the user)

- Set `CONFIG.BRAND_NAME`, `CONFIG.FORM_ENDPOINT`, `CONFIG.EXTERNAL_FORM_URL`, `CONFIG.CONTACT_EMAIL` in `site/app.js`.
- Replace every `<!-- PLACEHOLDER -->` item (logos, stats, case studies, testimonials) with real, permissioned proof.
- Add a real privacy policy link in the footer.
