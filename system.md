# system.md — AI Consulting Landing Page System

This file describes **how the system works**: the goal, the pipeline, the agents, the files they
hand to each other, and the conversion rules every agent must obey. `CLAUDE.md` tells Claude Code
how to operate in this repo; this file is the system design it operates.

---

## 1. Goal

Ship a **13-section, high-converting landing page** for an AI consulting service.

- **Single conversion goal:** the visitor fills out the contact form ("Book a free AI Opportunity
  Call") or clicks the external form link. Every section exists to move the visitor one step
  closer to that action. There is no second goal (no newsletter, no "read our blog" detours).
- **Primary audience:** founders, COOs, and department heads at 20–1,000 person companies who know
  AI matters, have tried ChatGPT or a pilot, and are frustrated it hasn't produced measurable ROI.
- **Success metric:** form-submission rate (visits → qualified leads). Secondary: scroll depth to
  section 13, CTA click-through rate.

---

## 2. Pipeline

```
 ┌────────────┐   docs/01-research.md   ┌──────────────────┐   docs/02-brief.md
 │ researcher │ ──────────────────────▶ │ research-        │ ──────────────────┐
 └────────────┘                         │ consolidator     │                   │
                                        └──────────────────┘                   ▼
                                                                     ┌──────────────────┐
     site/index.html  ◀──────────────  docs/03-copy.md  ◀─────────── │   copywriter     │
 ┌────────────────────┐                                              └──────────────────┘
 │ landing-page-      │
 │ builder            │ ───▶ site/ ───▶ ┌──────────────┐ ───▶ docs/04-cro-review.md
 └────────────────────┘                 │ cro-reviewer │      (fix list → builder/copywriter)
                                        └──────────────┘
```

| # | Agent | Reads | Writes | Done when |
|---|-------|-------|--------|-----------|
| 1 | `researcher` | this file, any input in `inputs/` | `docs/01-research.md` | Covers all 6 research areas in §5 with sources or "principle" tags |
| 2 | `research-consolidator` | `docs/01-research.md` | `docs/02-brief.md` | One-page brief: ICP, pains, promise, offer, objections, proof, voice, section map |
| 3 | `copywriter` | `docs/02-brief.md` | `docs/03-copy.md` | Final copy for all 13 sections, every CTA, form labels, microcopy |
| 4 | `landing-page-builder` | `docs/03-copy.md`, §6 below | `site/` | Page renders, form validates and submits, passes §7 checklist |
| 5 | `cro-reviewer` | `site/`, `docs/03-copy.md`, `docs/02-brief.md` | `docs/04-cro-review.md` | Scored audit + prioritized fix list; loop back to 3 or 4 if score < 85 |

**Hand-off rule:** an agent only reads its upstream file(s). If something is missing upstream, it
writes a `## Gaps` section in its own output instead of inventing facts.

---

## 3. The 13 sections (fixed structure)

Each section has one job. Copy and build must follow this order.

| # | Section | Job (the visitor's question it answers) | CTA? |
|---|---------|------------------------------------------|------|
| 1 | **Hero** | "What is this and is it for me?" — outcome headline, subhead, primary CTA, trust line | Primary |
| 2 | **Trust bar** | "Is this legit?" — client logos / credibility stats | — |
| 3 | **Problem** | "Do they get my situation?" — name the 3 pains in the visitor's words | — |
| 4 | **Cost of inaction** | "Why act now?" — stakes, quantified | Soft |
| 5 | **Solution / approach** | "What's different here?" — the unique mechanism | — |
| 6 | **Services** | "What exactly do I get?" — 3–4 packaged offers with outcomes | Primary |
| 7 | **Use cases** | "Does it work for my department?" — outcomes by function | — |
| 8 | **Process** | "What happens after I click?" — 4 steps, step 1 = the free call | Primary |
| 9 | **Results / case studies** | "Has it worked for others?" — numbers + mini-stories | — |
| 10 | **Testimonials** | "Do real people vouch for them?" — named, specific quotes | — |
| 11 | **Why us / comparison** | "Why not a big firm, a freelancer, or DIY?" — comparison table | Primary |
| 12 | **FAQ** | "What's the catch?" — objection handling (price, data, time, risk) | — |
| 13 | **Final CTA + form** | "OK, how do I start?" — risk reversal + short form + external link | **Form** |

Footer (not counted): minimal links, privacy, contact email.

---

## 4. Conversion principles (non-negotiable for every agent)

1. **One goal, repeated.** Same CTA verb and destination everywhere ("Book my free AI call" → `#contact`).
   Primary CTA appears at least 4 times, never more than one *different* action.
2. **Outcome over features.** Headlines promise a measurable result + timeframe, not "AI solutions".
3. **Visitor's language.** Pains are written the way a COO would say them out loud.
4. **Specific beats clever.** Numbers, timeframes, named roles. No "cutting-edge", "synergy", "revolutionize".
5. **Proof near every claim.** Each big promise is followed by a stat, logo, quote, or case.
6. **Answer objections before they're asked.** Price, data security, time commitment, "we tried AI and it failed".
7. **Reduce friction.** Form ≤ 5 fields, only 1 optional; microcopy under the button ("30 min · no pitch deck · no obligation").
8. **Risk reversal.** Free call, concrete deliverable from the call (a written AI opportunity map), clear guarantee language.
9. **Message match.** Hero headline matches the ad/email promise that brought the visitor.
10. **Scannable.** One idea per section, headlines readable in a 5-second skim, ≤ 3 lines per paragraph.
11. **Mobile first.** Thumb-reachable sticky CTA on mobile, tap targets ≥ 44px.
12. **Fast + accessible.** No heavy frameworks, LCP < 2.5s, semantic HTML, WCAG AA contrast, labelled form fields.
13. **Honest.** Placeholder proof (logos, stats, testimonials) is marked `<!-- PLACEHOLDER -->` and must be
    replaced with real, permissioned proof before launch. Never ship invented testimonials.

---

## 5. Research areas (for `researcher`)

1. Landing-page conversion best practices (B2B services specifically).
2. High-ticket consulting offer design (packaging, pricing signals, risk reversal).
3. AI-consulting buyer psychology: fears, desires, failed-pilot frustration, data/security concerns.
4. Competitor patterns: how AI agencies / consultancies position themselves, and the clichés to avoid.
5. Form design & lead-capture best practices (field count, qualifying questions, microcopy).
6. Trust & proof patterns for a new or small firm with limited case studies.

---

## 6. Technical stack (for `landing-page-builder`)

- **Single static page:** `site/index.html` + `site/styles.css` + `site/app.js`. No build step.
- **No frameworks, no external JS.** Google Fonts is the only external request.
- **Form:** posts to `CONFIG.FORM_ENDPOINT` in `site/app.js` (Formspree / Getform / your backend).
  If blank, the form shows the success state locally and logs the payload (dev mode).
  `CONFIG.EXTERNAL_FORM_URL` (Typeform / Google Form / Calendly) powers the "prefer a link?" CTA.
- **Brand tokens:** CSS variables at the top of `styles.css` (`--brand`, `--accent`, fonts).
- **Analytics hooks:** every CTA has `data-cta="<section-id>"`; `app.js` dispatches a
  `cta_click` event and a `lead_submit` event to `window.dataLayer` if present.

---

## 7. Definition of done (checked by `cro-reviewer`)

- [ ] All 13 sections present, in order, each with a unique `id`.
- [ ] Hero headline passes the 5-second test (who it's for + outcome + timeframe).
- [ ] Primary CTA appears ≥ 4 times, same wording, all lead to `#contact`.
- [ ] Form: ≤ 5 fields, labelled, client-side validation, success + error states, honeypot spam field.
- [ ] Every claim section has proof within one scroll.
- [ ] FAQ covers price, data security, timeline, failed-AI objection, "what if it doesn't work".
- [ ] Mobile: sticky CTA, no horizontal scroll at 360px.
- [ ] Accessibility: one `<h1>`, ordered headings, alt text, focus states, AA contrast.
- [ ] All placeholder proof is flagged with `<!-- PLACEHOLDER -->`.
