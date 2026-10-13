# Real-business Gemini evaluation — 2026-10-09

This is a research evaluation of the production `createGeminiProvider` prompt-answering and combined-analysis methods, using the configured `gemini-3.5-flash-lite` model. It is **not** an owner-verified PresenceAI scan. No businesses, Brand Truth records, prompts, or results were written to Supabase. The exact prompts, full model answers, raw provider payloads, and combined reports are in ignored local file `data/evaluations/2026-10-09-raw.json`.

## Method and result

Seven customer-style prompts each covered IKEA Hyderabad (physical furniture retail), Decathlon India (sports retail), and Canva (design software). The answering model received only the question, with no source material or Brand Truth. The same model then synthesized each seven-answer set using the production analysis instruction. I compared checkable claims with current official business pages on 2026-10-09. Subjective recommendations were assessed for what the model said, not scored as objectively correct.

Several prompts in this first set named the target business, so this run tests factual answer quality and summary faithfulness, **not unprompted brand visibility**. A separate unbranded follow-up appears below.

| Business | Prompt answers | Combined report | Answers with provider citations | Main result |
| --- | ---: | --- | ---: | --- |
| IKEA Hyderabad | 7/7 saved | Succeeded | 0 | Recommended IKEA, but gave a wrong precise address and could not state several published store/policy facts. |
| Decathlon India | 7/7 saved | Succeeded | 0 | Recommended Decathlon and identified its broad product range, but abstained on most published return and service policies. |
| Canva | 7/7 saved | Succeeded | 0 | Correct on Education and nonprofit access; uncertain about current plans and AI eligibility; overstated some export availability. |

Twelve of the 21 answers explicitly declined to give a definitive current answer or said the needed information was unavailable: IKEA prompts 2, 3, 4, 5, 7; Decathlon prompts 2, 3, 4, 5, 7; Canva prompts 2, 3. Some of these still contained useful partial information. All three combined reports generally reflected the supplied answers and used valid prompt-number references. They were not independent fact checks.

## Source checks

| Prompt | Model output and finding | Official reference |
| --- | --- | --- |
| IKEA 2, location and hours | Correct general Raidurg/HITEC City area, but gave `Plot No. 38/P, 4th Phase, Knowledge City` as the exact address. IKEA lists Survey No. 83/1, Plot Nos. 25/26/part 29, Panmaqtha, Raidurg. It did not provide store hours, which IKEA lists as 11:00–22:00 daily. **Wrong precise address; incomplete hours.** | [IKEA Hyderabad store](https://www.ikea.com/in/en/stores/hyderabad/) |
| IKEA 3, returns | Declined to state the India rule and suggested opened/assembled items may require being unused and in original packaging. IKEA India says a 365-day window and accepts opened/assembled products with a receipt under its stated refund conditions. **Misleading generalization, despite its uncertainty caveat.** | [IKEA India returns](https://www.ikea.com/in/en/customer-service/returns-claims/return-policy/) |
| IKEA 4–5, services and planning | Described delivery, assembly, click-and-collect, and remote kitchen planning as generally available, but did not confirm the local details or fee. IKEA's store and services pages list those services; the virtual-planning page gives a ₹1,000 online appointment fee. **Directionally correct but incomplete.** | [IKEA Hyderabad store](https://www.ikea.com/in/en/stores/hyderabad/), [virtual planning](https://www.ikea.com/in/en/customer-service/knowledge/articles/82e4733f-f4e5-4535-83da-7e0a6d9239d7.html) |
| IKEA 7, family facilities | Said it had no information. IKEA lists a restaurant (10:30–21:30) and Småland (11:00–21:00), both daily. **Missed published facts.** | [IKEA Hyderabad store](https://www.ikea.com/in/en/stores/hyderabad/) |
| Decathlon 2–3 and 7, returns | Declined to answer. Decathlon lists 30 days for eligible ordinary apparel in original condition with tags/proof of purchase; cycles are replacement-only, and clearance-sale items cannot be returned for a refund. **Missed published, purchase-relevant policies.** | [Decathlon India return policy](https://www.decathlon.in/shop/decathlon-return-policy) |
| Decathlon 4–6, service and range | Did not know its bicycle-service brand restriction or range size, but correctly said it sells cricket, yoga, cycling, and hiking gear. Decathlon restricts cycle service to its own-brand bicycles, lists 100+ Indian stores and 60 sports, and displays the named sport categories. **One supported product answer; two missed published facts.** | [Decathlon service terms](https://www.decathlon.in/page/decathlon-terms-and-condition), [stores](https://www.decathlon.in/store), [sports](https://www.decathlon.in/shop/decathlon-search-by-sport) |
| Canva 2–3, current AI and plans | Declined to answer. Canva says AI 2.0 Memory Library and Connectors are paid-plan features, while Free has limited AI 1.0; new paid sign-ups can choose Pro or Business, and Teams is closed to new sign-ups. **Missed current plan facts.** | [Canva AI eligibility](https://www.canva.com/help/using-canva-ai/), [Canva plans](https://www.canva.com/help/upgrade-to-canva-pro-or-business/), [Teams status](https://www.canva.com/help/about-canva-teams/) |
| Canva 4 and 7, Education and Nonprofits | Said eligible K–12 educators/students can use Education for free and eligible nonprofits can get Pro features for free. **Supported**, subject to eligibility/verification. | [Canva Education](https://www.canva.com/education/teachers/), [Canva for Nonprofits](https://www.canva.com/help/canva-for-nonprofits/) |
| Canva 5–6, exports and teams | Correct that PDF/PNG and premium SVG paths exist, but said Canva designs generally export to PPTX; Canva says PPTX export is for presentations only. It described team collaboration using the legacy Teams name while omitting current Business positioning. **Partly correct with scope and naming errors.** | [Canva download types](https://www.canva.com/help/download-file-types/), [Canva Business](https://www.canva.com/help/upgrade-to-canva-pro-or-business/) |

The broad recommendation prompts (IKEA 1/6, Decathlon 1, Canva 1/7) show whether a business appears in an answer and the model's stated reasons. They do not prove relative value, quality, price, or competitor ranking. No answer contained provider web citations; the model was not configured for web grounding.

## Assessment of the combined analyses

- **Faithfulness to answers:** All three reports summarized the major themes and uncertainty in their seven inputs, with prompt-number references that point to relevant answers.
- **Factual accuracy:** The reports cannot establish it. The IKEA report called the location successfully identified while omitting the incorrect precise address from prompt 2. The Decathlon report used “confirmed” for product availability even though it only had an uncited model answer. The Canva report repeated broad export support without preserving the presentation-only PPTX restriction.
- **Actionable gap:** The report must compare extracted, evidence-linked claims with current verified sources or owner-verified Brand Truth, label unknowns, and distinguish a recommendation from a bare mention. Until then, the product should present these reports as summaries of AI output only.

This is one run of one model on 21 selected prompts, not a reproducibility study or a general accuracy percentage. Current policies and product eligibility can change; recheck the linked official pages for operational use.

## Unbranded discovery follow-up

The production prompt generator was changed to use business category and location without naming the business or passing Brand Truth data into questions. Five generated prompts each (discovery, recommendation, comparison) were run for the same three public businesses. All 15 answer calls and three combined analyses succeeded; none had provider web citations. Complete inputs, answers, and reports are in ignored local file `data/evaluations/2026-10-09-unbranded-raw.json`.

| Business | Exact full-name mentions | Location-free brand mentions | Unbranded answers |
| --- | ---: | ---: | ---: |
| IKEA Hyderabad | 0 | 4 (`IKEA`) | 5 |
| Decathlon India | 0 | 3 (`Decathlon`) | 5 |
| Canva | 5 | 5 (`Canva`) | 5 |

The full-name-only dashboard metric would have hidden IKEA and Decathlon's visibility. The dashboard now matches a location-free form when the saved name ends in the saved city or country, shows which forms were used, and excludes prompts containing any of those forms from the unprompted denominator. This is still a literal name match, not a recommendation or ranking score.

This run also exposed prompt-quality issues: “near me” caused the model to disclaim not knowing the precise user location, and broad affordability/comparison questions without a city sometimes elicited US retailers for Indian businesses. The generator was refined afterward to include the city in local affordability/comparison questions and to say “sports gear” rather than “sports” for a sports-store category. Those final template refinements are unit-tested but were **not rerun live** in this evaluation.
