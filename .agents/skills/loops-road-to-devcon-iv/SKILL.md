---
name: loops-road-to-devcon-iv
description: >-
  Build for the Road To Devcon - IV on Loops House: ideate with the AI
  mentor, query problem knowledge graphs (graph-RAG over each problem's
  resources), create and update the project submission, save ideation
  artifacts, and check the work against each problem's success criteria. Use
  this skill whenever the user mentions Road To Devcon - IV, this contest, its
  problems or standings, submitting or improving their entry, problem
  docs/stacks, judging, or asks "what should I build" — even if they never
  say "loops".
version: 0.4.0
requires_bin: loops
---

# Road To Devcon - IV — Loops House skill

Help the builder compete in ONE event: `road-to-devcon-iv`. This skill carries the event data, ready-to-run `loops` commands, and the workflow below. Commands come pre-filled with the right slugs — replace only the `<angle-bracket>` placeholders. Never invent or substitute ids: the user has at most one project per event (team membership counts), and the platform resolves it from the session, so no project id appears anywhere in this skill.

The user has no project here yet. Ideate freely; create one with `loops project create` when they are ready to submit.

## How to work with the builder

**This is a conversation, not a script.** The builder is entering a
competition that judges *their* work. Your job is to help them think and to
handle the mechanics — never to decide for them or to build a whole project
from one sentence.

Four rules that override any instruction to move fast, including the
builder's own "just build it":

1. **Never submit or update anything they have not seen and approved.** The
   command enforces this: without `--confirm` it returns the draft and writes
   nothing. Show that draft, wait for a clear yes, then confirm.
2. **Never choose their problem for them.** Ask which one, and wait for the answer.
3. **Never start writing project code off a one-liner.** Get a direction they
   have actually agreed to first.
4. **Ask one question at a time.** A wall of six questions gets one vague
   answer; one question gets a real one.

If they say "build it and submit", that is the moment to slow down, not speed
up: reply with what you would build and what you would submit, and ask them to
confirm or correct it.

## The flow

Each step ends where the builder speaks. Do not run ahead of them.

1. **Check auth.** `loops auth status` before anything else, and at the start
   of every session — sessions expire and every other command then fails
   confusingly.
2. **Orient, then report back.** Read the event data below (stage, deadlines,
   problems) and run `loops project get --event road-to-devcon-iv`. Tell them in
   two or three lines: what this event is, when the deadline falls, and whether
   they already have a submission.
3. **Make sure they are registered.** `loops enroll --event road-to-devcon-iv` is
   idempotent, so it is safe to run — but it needs a display name, a location
   and an age bracket if their profile lacks them. **Ask the builder for those;
   never invent them.** They land in the organiser's participant export.
4. **Ask what they want to build.** Which problem are they going for — name them with one line each, and ask. Then ask what approach they have in mind, even roughly. **Wait for an answer to both.**
5. **Ideate with them, not for them.** Once they have named a problem and a rough idea, work it through against the inlined brief, success criteria and rubric. Ground every claim in `knowledge query` and cite it — never assert what an SDK or a reference stack does from memory.
6. **Build only what they agreed to.** Their repo, their commits. If scope
   drifts past what they approved, say so and ask.
7. **Draft the submission, then let them decide.** Run `project create`
   (or `project update`) **without** `--confirm` first. It writes nothing and
   returns the exact draft — the repo it will submit. Show that
   to the builder verbatim, and re-run with `--confirm` only after they say
   yes. **Never pass `--confirm` on the first call or on their behalf.** A
   submission is what the judge reads; a wrong one costs them the event.
8. **Submit, then evaluate.** After an explicit yes, create or update. Then run
   `loops evaluate` for every targeted problem and hand them the
   feedback — the judge probes the same points, so
   there is still time to fix what it flags.

Command output is structured (add `--json` for machine-readable form) and often ends with a suggested next command (CTA) — follow it rather than guess. On `NOT_AUTHENTICATED`, run the auth flow. On `credits_exhausted`, stop and tell the user — never retry.

## Authenticate

```sh
loops auth status                        # run FIRST — who am I?
loops --version   # must match this skill's frontmatter `version`
```

If the installed CLI is older than this skill's `version`, update first (`npm install -g loopshouse@latest`) — the commands below assume the stamped version.

A failed check means the CLI still needs install + login. Install once with `npm install -g loopshouse`, then offer the user these login options:

- **Google**: `loops auth login --provider google` — opens the browser.
- **GitHub**: `loops auth login --provider github` — opens the browser.
- **Email one-time code**: `loops auth login --email <you@example.com>` sends a 6-digit code; verify with `loops auth verify --email <you@example.com> --code <123456>`.

In headless contexts the browser flows print a URL for a human to open. Re-run `loops auth status` to confirm before continuing.

## Read the event data

Treat this TOON document as ground truth for the event (TOON = compact JSON: `key: value` lines; a uniform array renders as a `name[N]{col1,col2,…}:` header plus one comma-separated row per element):

```toon
event:
  slug: road-to-devcon-iv
  name: Road To Devcon - IV
  tagline: Onchain Identity
  stage: build_open
  stageMeaning: Building phase — submissions are OPEN until the end date
  timezone: Asia/Calcutta
  prizeCurrency: USD
  startsAt: "Sep 11, 2026, 11:11 PM (Asia/Calcutta)"
  submissionDeadline: "Sep 13, 2026, 11:11 PM (Asia/Calcutta)"
  registrationDeadline: "Sep 12, 2026, 11:11 PM (Asia/Calcutta)"
  description: null
problems[3]:
  - title: Nobody Needs Your Aadhaar Number
    slug: anon-aadhaar-one-person-one-claim
    brief: "Kavita runs a small education grant out of a two-room office in Nagpur — ₹15,000 a year to first-generation college students across Vidarbha. Last cycle she received 4,200 applications for 60 grants. Her volunteers found the same person applying eleven times under different email addresses, a WhatsApp group coaching people on how to farm the form, and a few dozen entries that were plainly scripted. The obvious fix is to ask for an Aadhaar number. Kavita refuses. The moment that spreadsheet exists it is a liability she cannot defend, and a good share of her applicants would walk away rather than hand it over. They would be right to. What she actually needs is much narrower than an identity. F…"
    successLooksLike: "An eligible applicant gets exactly one application per cycle, and Kavita's office never holds an Aadhaar number."
    suggestedStack[6]: Anon Aadhaar SDK,Next.js,TypeScript,Solidity,Hardhat or Foundry,Postgres or SQLite
    judgingCriteria[1]{name,weightPct}:
      "Problem interpretation, product judgment & code craft",20
  - title: "Log In With a Wallet, Trust Only the Signature"
    slug: siwe-backend-verification
    brief: "Ridhima runs Kitaab Bazaar, a resale marketplace for second-hand engineering textbooks used across about forty colleges. Sellers list books, buyers collect on campus, and Kitaab Bazaar settles the money at the end of each week. The login is the part she hates. SMS OTPs cost her money on every attempt, students change numbers between semesters, and password resets are most of her support inbox. Half her sellers already carry a wallet. She wants that to be the login. What worries her is everything on the other side of the connect button. A seller's account holds their listings and their payout details, so an account that can be entered by anyone who knows the seller's address is worse than the…"
    successLooksLike: "A seller connects a wallet, signs once, and lands in their own account — and no hand-crafted request puts anyone into somebody else's."
    suggestedStack[6]: viem or ethers,wagmi,Next.js,TypeScript,Express or Next route handlers,iron-session or JWT
    judgingCriteria[1]{name,weightPct}:
      "Problem interpretation, product judgment & code craft",20
  - title: A Seal of Belonging for Every Chaupal
    slug: merkle-community-membership-seals
    brief: "India has never run on a single template. A Punjabi sangat that feeds whoever walks in. A Maharashtrian mandal that has organised the same Ganpati for sixty years. A weavers' collective in Nagaland where the pattern on a shawl tells you the village. Each carries its own lineage, its own customs, its own idea of who counts as one of us — and membership in each of them is a real, specific thing, kept locally: a register in a steel cupboard, an elder who knows every family by name. Chaupal is a small network trying to bring twelve of these groups into one shared space — joint event listings, group-only threads, a pooled discount scheme with local vendors. Two things are non-negotiable for the t…"
    successLooksLike: "A member of any one of the twelve groups proves they belong and holds a seal only they can hold, while the group's list stays in the group's cupboard."
    suggestedStack[6]: Solidity,@openzeppelin/merkle-tree,OpenZeppelin Contracts,Foundry or Hardhat,viem,Next.js
    judgingCriteria[1]{name,weightPct}:
      "Problem interpretation, product judgment & code craft",20
```

`event.stage` and the deadlines are snapshots from when this skill was generated and do not update — sanity-check timing before planning multi-day work.

## Budget credits

**1 credit = one ideator turn or one knowledge-graph query.** Project and artifact commands and the evaluator prompt are free. Spend credits on load-bearing questions, not browsing, and check the balance before a research burst:

```sh
loops credits --event road-to-devcon-iv
```

## Query problem knowledge graphs (graph-RAG)

Each problem in this contest has a knowledge graph built from its brief, resources, and reference materials. A query returns a **cited evidence block** (entities, relationships, chunks, sources) — read the evidence and compose the answer yourself, citing it. The event data above already inlines each problem's brief, success criteria, stack, and rubric — answer from it first; query the graph for reference materials and depth the inline data doesn't carry, and to fetch the full brief when the inline one ends in "…" (long briefs are clipped). 1 credit per query. One ready command per problem:

```sh
# Nobody Needs Your Aadhaar Number
loops knowledge query --event road-to-devcon-iv --problem anon-aadhaar-one-person-one-claim -q "<your question about Nobody Needs Your Aadhaar Number>"

# Log In With a Wallet, Trust Only the Signature
loops knowledge query --event road-to-devcon-iv --problem siwe-backend-verification -q "<your question about Log In With a Wallet, Trust Only the Signature>"

# A Seal of Belonging for Every Chaupal
loops knowledge query --event road-to-devcon-iv --problem merkle-community-membership-seals -q "<your question about A Seal of Belonging for Every Chaupal>"
```

## Manage the project

The project IS the submission. The user has at most one here, and the platform resolves it from the session — no ids, no listings.

```sh
loops project get --event road-to-devcon-iv       # current state (exists=false if none yet)
loops project create --event road-to-devcon-iv --repoUrl <url>
loops project update --event road-to-devcon-iv --description "<new description>"
```

**The repo IS the entry**: create ONLY when a real GitHub repository exists to submit — the platform rejects a repo-less compete submission. Never create a placeholder entry "to fill in later"; the user then has to repair it by hand.

**Update is a PATCH**: only the fields you pass change — an update with just `--tagline` cannot wipe the repo URL. Fields: `--name`, `--tagline`, `--pitch`, `--description`, `--repoUrl`, `--demoUrl`, `--videoUrl`.

## Evaluate the project against a problem

Fetch a self-contained evaluator prompt for one problem (free; the platform attaches the user's project record), then **execute the prompt yourself inside the project repo** — it assumes the code access you have. The prompt walks that problem's brief, success criteria, and weighted judging criteria and returns alignment feedback: verified strengths, gaps, and where to focus. Run it for every problem the project targets, well before the deadline.

```sh
# Nobody Needs Your Aadhaar Number
loops evaluate --event road-to-devcon-iv --problem anon-aadhaar-one-person-one-claim

# Log In With a Wallet, Trust Only the Signature
loops evaluate --event road-to-devcon-iv --problem siwe-backend-verification

# A Seal of Belonging for Every Chaupal
loops evaluate --event road-to-devcon-iv --problem merkle-community-membership-seals
```

Report the feedback to the user, then apply agreed improvements via `loops project update`.
