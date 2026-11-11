# 04 — CRO Review (cro-reviewer)

Reviewed: `site/index.html`, `site/styles.css`, `site/app.js` (2026-11-11). Tested at 456px (mobile) and 1366×768.

## Score
| Area | Score |
|---|---|
| Clarity | 18 / 20 |
| Offer & CTA | 19 / 20 |
| Proof | 9 / 15 — all proof is placeholder |
| Objection handling | 14 / 15 |
| Form friction | 14 / 15 |
| UX / tech | 14 / 15 |
| **Total** | **88 / 100** — passes; no loop back needed. **Not launch-ready until the blockers below are fixed.** |

## Definition of done (system.md §7)
- ✅ 13 sections in order with unique ids (hero → contact), verified in the browser.
- ✅ Hero says who it's for, the outcome, and the timeframe: "Your first AI workflow, live and paying off in 30 days."
- ✅ Primary CTA "Book my free AI call" × 7 (nav, hero, services, process, compare, form, sticky), all to `#contact`.
- ✅ Form: 4 required fields + 1 optional, labels, inline validation (tested), success state (tested), error state, honeypot.
- ✅ Proof within one scroll of each claim: trust bar after hero, results/testimonials after process.
- ✅ FAQ covers price, data security, time, "AI flopped before", "what if it doesn't deliver", maintenance.
- ✅ Mobile: sticky CTA appears after the hero and hides at the form; no horizontal page scroll (the comparison table scrolls inside its own labelled region).
- ✅ One `<h1>`, logical headings, focus rings, `prefers-reduced-motion`, skip link.
- ✅ Placeholder proof flagged with `<!-- PLACEHOLDER -->`.

## Top fixes (by expected impact)
1. **Replace placeholder proof with real proof.** Owner: user → copywriter. Real logos, stats, and named testimonials are the biggest conversion lever left.
2. **Add a founder/team credibility strip** (photo, past roles, systems shipped) between Results and Testimonials, or fold it into section 11. A small firm with few logos needs it. Owner: copywriter, then builder.
3. **Set `CONFIG.EXTERNAL_FORM_URL`**. Until it's set, the "Prefer a form link?" option stays hidden. Owner: user.
4. **Connect `CONFIG.FORM_ENDPOINT`** (Formspree/HubSpot/CRM) and send an auto-reply email that keeps the "3 time slots in 1 business day" promise. Owner: user / builder.
5. **Message match:** if you run ads, create one hero variant per ad angle (see the headline alternatives in `03-copy.md`). Owner: copywriter.

## A/B tests after launch
1. Hero headline: "30 days" outcome vs "Stop piloting AI. Start profiting from it." Hypothesis: the failed-pilot angle converts better for buyers who already tried AI.
2. Show a price anchor ("Sprints from $8k") in the services section vs FAQ only. Hypothesis: fewer leads, but better qualified.
3. Inline form vs a calendar embed in section 13. Hypothesis: a direct booking cuts drop-off between submitting the form and having the call.

## Launch blockers
- ❌ Placeholder testimonials, case studies, logos, stats, and rating. Do not publish these as if they were real.
- ❌ Pricing range and guarantee terms need the owner to confirm them.
- ❌ Brand name, contact email, and privacy policy URL still have placeholder values in `CONFIG`.
