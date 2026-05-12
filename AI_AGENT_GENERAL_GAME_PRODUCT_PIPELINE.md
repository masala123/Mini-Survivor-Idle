# AI Agent Game Product Development Pipeline

> Purpose: This document defines a general-purpose game product development pipeline for AI agents.
> It is designed for any commercial game project, regardless of genre, engine, platform, or business model.

---

## 0. Product Definition

### Goal

Turn a game idea into a sellable product through a structured pipeline:

```text
Idea
→ Product Brief
→ Market Validation
→ Prototype
→ Vertical Slice
→ Production
→ Alpha
→ Beta
→ Release Candidate
→ Launch
→ Post-Launch Operation
```

### Core Principle

A game is not only a software project.  
A sellable game product requires:

- Fun gameplay
- Clear target audience
- Stable technical foundation
- Strong presentation
- Business positioning
- Store-ready packaging
- Marketing assets
- QA and release process
- Post-launch support plan

---

# 1. Phase Overview

| Phase | Main Goal | Output |
|---|---|---|
| 01 Product Discovery | Define what the game is and who it is for | Product Brief |
| 02 Market Research | Validate audience and commercial potential | Market Research Report |
| 03 Concept Design | Define core fantasy, mechanics, scope | Concept GDD |
| 04 Prototype | Prove core gameplay is fun | Playable Prototype |
| 05 Vertical Slice | Prove final-quality direction | Vertical Slice Build |
| 06 Production Planning | Lock scope, roadmap, budget, team roles | Production Plan |
| 07 Full Production | Build all core content and systems | Feature-Complete Build |
| 08 Alpha | All major systems playable | Alpha Build |
| 09 Beta | Content complete, polish and bug fixing | Beta Build |
| 10 Release Candidate | Store-ready, stable, compliant build | RC Build |
| 11 Launch | Publish and sell the product | Live Product |
| 12 Post-Launch | Fix, update, monetize, grow community | Live Roadmap |

---

# 2. Phase 01 — Product Discovery

## Objective

Define the product clearly before development begins.

## AI Agent Tasks

- Identify the game genre.
- Identify the target platform.
- Define the target audience.
- Define the core gameplay promise.
- Define the product positioning.
- Define the monetization model.
- Define the expected production scale.

## Key Questions

| Question | Example |
|---|---|
| What is the player fantasy? | Become a powerful survivor, builder, racer, commander |
| What does the player do every minute? | Fight, build, collect, solve, manage, explore |
| What makes the game different? | Unique mechanic, theme, art style, progression, social feature |
| Who will buy or play it? | Casual PC players, mobile idle players, hardcore roguelike fans |
| Where will it be sold? | Steam, itch.io, Epic, App Store, Google Play, web, console |
| How will it make money? | Premium, free-to-play, ads, DLC, cosmetics, battle pass |

## Required Deliverables

- `product_brief.md`
- `target_audience.md`
- `platform_strategy.md`
- `monetization_strategy.md`
- `scope_assumption.md`

## Exit Criteria

Move forward only when:

- The game concept can be explained in one sentence.
- The target audience is clear.
- The platform is selected.
- The monetization model is selected.
- The initial scope is realistic.

---

# 3. Phase 02 — Market Research

## Objective

Check whether the product has commercial potential.

## AI Agent Tasks

- Analyze similar games.
- Identify market size and demand signals.
- Study Steam tags, reviews, wishlists, pricing, trailers, capsules, screenshots.
- Identify competitor strengths and weaknesses.
- Find player complaints in existing games.
- Identify content gaps and opportunities.

## Research Targets

| Area | What to Analyze |
|---|---|
| Competitors | Similar games in genre and platform |
| Pricing | Common price range and discount behavior |
| Reviews | Positive and negative player feedback |
| Visual Positioning | Art style, store capsule, trailer quality |
| Feature Expectations | Features players expect from the genre |
| Monetization | Premium, DLC, cosmetic, ads, gacha, subscription |
| Risk | Oversaturated genre, high production cost, poor retention |

## Required Deliverables

- `market_research.md`
- `competitor_matrix.md`
- `commercial_risk_report.md`
- `store_positioning_notes.md`

## Exit Criteria

Move forward only when:

- At least 5 comparable games are analyzed.
- The target price or monetization model is justified.
- The game has a clear differentiator.
- The production scope matches the market opportunity.

---

# 4. Phase 03 — Concept Design

## Objective

Convert the idea into a structured game concept.

## AI Agent Tasks

- Define core loop.
- Define meta loop.
- Define player progression.
- Define session length.
- Define controls.
- Define camera style.
- Define visual direction.
- Define audio direction.
- Define user experience goals.
- Define accessibility goals.

## Core Design Documents

| Document | Purpose |
|---|---|
| `game_design_document.md` | Main game design reference |
| `core_loop.md` | Minute-to-minute gameplay loop |
| `meta_progression.md` | Long-term progression |
| `feature_list.md` | Full feature list |
| `mvp_scope.md` | Minimum viable product scope |
| `art_direction.md` | Visual identity |
| `audio_direction.md` | Sound and music identity |
| `ux_flow.md` | Menu, HUD, onboarding, store flow |

## Design Scope Levels

| Scope Level | Meaning |
|---|---|
| Prototype Scope | Only proves the core mechanic |
| MVP Scope | Smallest version that can be released |
| Full Release Scope | Complete commercial product |
| Post-Launch Scope | Future updates after release |

## Exit Criteria

Move forward only when:

- The core loop is documented.
- The MVP scope is clearly smaller than full release scope.
- Must-have and nice-to-have features are separated.
- The product has a defined visual and UX direction.

---

# 5. Phase 04 — Prototype

## Objective

Test whether the core gameplay is fun before investing in full production.

## AI Agent Tasks

- Build a rough playable version.
- Use placeholder art and sound.
- Ignore polish.
- Focus only on the core mechanic.
- Measure whether the player understands and enjoys the loop.

## Prototype Rules

Do not build:

- Full UI
- Full art
- Full story
- Full progression
- Full economy
- Full save system
- Full content library

Build only what proves the core gameplay.

## Prototype Deliverables

- `prototype_build`
- `prototype_test_plan.md`
- `prototype_feedback.md`
- `core_fun_assessment.md`

## Prototype Test Questions

| Question | Pass Signal |
|---|---|
| Does the player understand what to do? | Yes, without long explanation |
| Is the core action satisfying? | Player wants to repeat it |
| Is the decision-making interesting? | Player makes meaningful choices |
| Is there tension or reward? | Player feels progress or challenge |
| Should this become a real product? | Strong yes |

## Exit Criteria

Move forward only when:

- The prototype proves the core mechanic.
- At least one fun loop is repeatable.
- Major design risks are identified.
- The team agrees the game is worth producing.

---

# 6. Phase 05 — Vertical Slice

## Objective

Create a small but final-quality sample of the game.

## Difference Between Prototype and Vertical Slice

| Prototype | Vertical Slice |
|---|---|
| Tests fun | Tests product quality |
| Uses placeholder assets | Uses near-final assets |
| Rough code acceptable | Production-quality code required |
| Small mechanic focus | Complete mini experience |
| Internal validation | Investor/store/marketing validation |

## Vertical Slice Must Include

- Final or near-final art style
- Final camera style
- Final UI direction
- Core gameplay loop
- Audio feedback
- Basic onboarding
- One polished gameplay scenario
- Save/load if needed
- Performance target check
- Build packaging test

## Required Deliverables

- `vertical_slice_build`
- `vertical_slice_gdd_update.md`
- `technical_validation.md`
- `art_validation.md`
- `ux_validation.md`
- `production_risk_report.md`

## Exit Criteria

Move forward only when:

- The game looks close to the intended final product.
- Core systems are technically viable.
- Performance target is achievable.
- The scope can be estimated with reasonable confidence.

---

# 7. Phase 06 — Production Planning

## Objective

Create the complete production plan before full production starts.

## AI Agent Tasks

- Break down all systems.
- Break down all content.
- Estimate development time.
- Identify dependencies.
- Define milestones.
- Define testing strategy.
- Define release platform requirements.
- Define team roles.
- Define outsourcing needs.
- Define marketing timeline.

## Required Planning Documents

| Document | Purpose |
|---|---|
| `production_roadmap.md` | High-level milestone schedule |
| `task_breakdown.md` | Full task list |
| `technical_architecture.md` | Code, engine, data, save, build architecture |
| `content_plan.md` | Levels, items, enemies, characters, missions |
| `qa_plan.md` | Testing process |
| `risk_register.md` | Risks and mitigation |
| `release_plan.md` | Store and launch process |
| `marketing_plan.md` | Visibility and wishlist strategy |

## Production Gates

| Gate | Requirement |
|---|---|
| Scope Gate | MVP and release scope approved |
| Tech Gate | Architecture validated |
| Art Gate | Style and asset pipeline approved |
| UX Gate | Main player flow validated |
| Business Gate | Platform, price, and monetization approved |
| QA Gate | Testing pipeline defined |

## Exit Criteria

Move forward only when:

- Tasks are broken down into implementable units.
- Feature dependencies are known.
- The roadmap has realistic milestones.
- Risk mitigation exists for high-risk systems.
- Build and test process is defined.

---

# 8. Phase 07 — Full Production

## Objective

Build the game according to the approved scope.

## AI Agent Development Priority

Build in this order:

```text
Foundation
→ Core Gameplay
→ Progression
→ Content
→ UX
→ Polish
→ Optimization
→ Release Systems
```

## System Implementation Order

| Priority | System |
|---|---|
| 1 | Project setup, repository, build pipeline |
| 2 | Input, camera, player controller |
| 3 | Core gameplay interaction |
| 4 | Game state and data model |
| 5 | Inventory/resource/economy if applicable |
| 6 | Combat/puzzle/simulation/management core |
| 7 | Progression and unlocks |
| 8 | Save/load |
| 9 | UI/HUD/menu |
| 10 | Content pipeline |
| 11 | Audio/VFX feedback |
| 12 | Settings/accessibility |
| 13 | Analytics/telemetry if applicable |
| 14 | Platform integration |
| 15 | Optimization |
| 16 | Store packaging |

## Required Production Practices

- Use version control.
- Use issue tracking.
- Use milestone branches.
- Use automated builds where possible.
- Keep design docs updated.
- Avoid undocumented features.
- Keep content data-driven where possible.
- Maintain changelog.
- Maintain known issues list.

## Required Deliverables

- `feature_complete_build`
- `updated_gdd.md`
- `updated_task_breakdown.md`
- `known_issues.md`
- `performance_report.md`
- `content_completion_report.md`

## Exit Criteria

Move forward only when:

- All must-have systems exist.
- All must-have content exists.
- Major placeholder assets are replaced.
- Save/load works.
- Main gameplay loop works from start to finish.
- No critical blockers remain.

---

# 9. Phase 08 — Alpha

## Objective

Verify that the whole game is playable from start to finish.

## Alpha Definition

Alpha means:

- Feature complete
- Core content playable
- Still buggy
- Still unpolished
- Balance incomplete
- Optimization incomplete

## AI Agent Tasks

- Test full playthrough.
- Fix critical bugs.
- Validate save/load.
- Validate progression.
- Validate economy pacing.
- Validate onboarding.
- Validate performance baseline.
- Identify missing content.
- Identify unclear UX.

## Alpha Test Types

| Test | Purpose |
|---|---|
| Smoke Test | Does the game boot and start? |
| Full Playthrough Test | Can the game be completed? |
| Save/Load Test | Does persistence work? |
| Progression Test | Can players unlock required content? |
| Economy Test | Are rewards and costs functional? |
| UX Test | Can players understand the flow? |
| Crash Test | Does anything break the game? |

## Required Deliverables

- `alpha_build`
- `alpha_test_report.md`
- `critical_bug_list.md`
- `balance_issue_list.md`
- `ux_issue_list.md`

## Exit Criteria

Move forward only when:

- The game can be played from start to finish.
- No game-breaking progression blocker remains.
- Critical crashes are fixed.
- The product direction is locked.

---

# 10. Phase 09 — Beta

## Objective

Polish, balance, optimize, and prepare for release.

## Beta Definition

Beta means:

- Content complete
- Feature complete
- Mostly stable
- Balance under review
- UX under review
- Final polish in progress

## AI Agent Tasks

- Fix high-priority bugs.
- Improve onboarding.
- Improve UI clarity.
- Tune economy and difficulty.
- Optimize performance.
- Finalize audio.
- Finalize visuals.
- Prepare store assets.
- Prepare marketing materials.
- Prepare localization if needed.

## Beta Test Groups

| Group | Purpose |
|---|---|
| Internal Team | Technical and design validation |
| Closed Testers | Fresh user feedback |
| Genre Players | Market-fit feedback |
| Non-Genre Players | Onboarding and accessibility feedback |
| Streamers/Creators | Watchability and content clarity |

## Required Deliverables

- `beta_build`
- `beta_feedback_report.md`
- `balance_tuning_report.md`
- `optimization_report.md`
- `store_asset_checklist.md`
- `release_readiness_report.md`

## Exit Criteria

Move forward only when:

- No critical or high-severity bugs remain.
- The first-time user experience is understandable.
- Performance meets the platform target.
- Store page assets are ready.
- The game has a release candidate checklist.

---

# 11. Phase 10 — Release Candidate

## Objective

Prepare the final build for publishing.

## Release Candidate Definition

A release candidate is a build that could be shipped if no blocking issue is found.

## AI Agent Tasks

- Run full regression testing.
- Verify build packaging.
- Verify platform requirements.
- Verify store metadata.
- Verify achievements if applicable.
- Verify cloud save if applicable.
- Verify controller support if applicable.
- Verify localization.
- Verify privacy policy if needed.
- Verify crash reporting if used.
- Verify credits and legal notices.

## Store Readiness Checklist

| Item | Required |
|---|---|
| Game title | Yes |
| Store description | Yes |
| Short description | Yes |
| Capsule image | Yes |
| Screenshots | Yes |
| Trailer | Strongly recommended |
| Tags/genres | Yes |
| Price | Yes |
| System requirements | Yes |
| Developer/publisher name | Yes |
| EULA/privacy policy | If needed |
| Build uploaded | Yes |
| Launch date | Yes |

## Required Deliverables

- `release_candidate_build`
- `rc_test_report.md`
- `store_page_checklist.md`
- `legal_checklist.md`
- `launch_checklist.md`

## Exit Criteria

Move forward only when:

- Final build passes regression testing.
- Store assets are complete.
- Platform compliance is complete.
- Launch communication is ready.
- Rollback/hotfix plan exists.

---

# 12. Phase 11 — Launch

## Objective

Publish the game and convert audience interest into sales or players.

## AI Agent Tasks

- Publish the game build.
- Verify store page visibility.
- Verify pricing.
- Verify download/install.
- Verify launch build.
- Monitor crash reports.
- Monitor player reviews.
- Monitor community feedback.
- Prepare day-one patch if needed.
- Communicate known issues.

## Launch Channels

| Channel | Purpose |
|---|---|
| Steam / itch.io / App Store / Google Play | Sales and distribution |
| Discord | Community hub |
| YouTube | Trailer and devlog |
| TikTok / Shorts | Short-form discovery |
| Reddit | Genre community discovery |
| Press kit | Media coverage |
| Email list | Direct audience |
| Creator outreach | Streaming and video coverage |

## Launch Day Checklist

- Build is live.
- Store page is correct.
- Trailer works.
- Screenshots display correctly.
- Price is correct.
- Download works.
- Save system works.
- Analytics/crash reporting works if used.
- Community channels are monitored.
- Known issue post is ready.
- Hotfix branch is ready.

## Required Deliverables

- `launch_report.md`
- `day_one_issue_list.md`
- `player_feedback_summary.md`
- `hotfix_plan.md`

## Exit Criteria

Launch phase is complete when:

- Game is publicly available.
- Major launch blockers are resolved.
- Initial feedback is collected.
- First post-launch plan is created.

---

# 13. Phase 12 — Post-Launch Operation

## Objective

Support the game after release and grow the product.

## AI Agent Tasks

- Fix bugs.
- Improve balance.
- Add quality-of-life improvements.
- Respond to common feedback.
- Track reviews.
- Track retention.
- Track sales or revenue.
- Plan content updates.
- Plan discounts and events.
- Prepare DLC or major updates if viable.

## Post-Launch Update Types

| Update Type | Purpose |
|---|---|
| Hotfix | Urgent bug fix |
| Patch | Bug fixes and minor improvements |
| QoL Update | User experience improvements |
| Balance Update | Difficulty/economy tuning |
| Content Update | New levels, items, characters, modes |
| Seasonal Event | Time-limited engagement |
| DLC | Paid expansion |
| Major Update | Large feature expansion |

## Metrics to Track

| Metric | Meaning |
|---|---|
| Sales | Commercial performance |
| Wishlists | Future sales potential |
| Conversion Rate | Store page effectiveness |
| Refund Rate | Product mismatch or technical issue |
| Review Score | Player satisfaction |
| Playtime | Engagement |
| Retention | Long-term interest |
| Crash Rate | Technical stability |
| Support Tickets | Pain points |
| Community Sentiment | Brand health |

## Required Deliverables

- `post_launch_roadmap.md`
- `patch_notes.md`
- `feedback_tracker.md`
- `sales_and_metric_review.md`
- `community_report.md`

---

# 14. Universal AI Agent Roles

## Product Roles

| Role | Responsibility |
|---|---|
| Product Director Agent | Product vision, scope, business goals |
| Game Director Agent | Core experience and creative direction |
| Producer Agent | Schedule, milestones, risk, task tracking |
| Market Research Agent | Competitor and audience research |
| Monetization Agent | Pricing, DLC, F2P, ads, economy strategy |

## Design Roles

| Role | Responsibility |
|---|---|
| Game Designer Agent | Mechanics, rules, systems |
| Level Designer Agent | Levels, encounters, pacing |
| Economy Designer Agent | Costs, rewards, progression |
| Narrative Designer Agent | Story, characters, worldbuilding |
| UX Designer Agent | Player flow, onboarding, HUD, menus |

## Engineering Roles

| Role | Responsibility |
|---|---|
| Technical Director Agent | Architecture and engineering standards |
| Gameplay Programmer Agent | Mechanics and player systems |
| Tools Programmer Agent | Editor tools and pipelines |
| UI Programmer Agent | Interface implementation |
| Backend Programmer Agent | Online services if needed |
| Build Engineer Agent | Build, packaging, CI/CD |

## Art and Audio Roles

| Role | Responsibility |
|---|---|
| Art Director Agent | Visual identity |
| Concept Artist Agent | Concept exploration |
| 2D/3D Artist Agent | Asset production |
| Animator Agent | Motion, combat readability |
| VFX Artist Agent | Feedback and effects |
| Audio Designer Agent | SFX, music, audio identity |

## QA and Release Roles

| Role | Responsibility |
|---|---|
| QA Lead Agent | Test strategy |
| QA Tester Agent | Bug finding and regression |
| Performance Agent | Optimization and profiling |
| Localization Agent | Multi-language support |
| Compliance Agent | Platform requirement checks |
| Community Agent | Feedback, reviews, announcements |

---

# 15. Master File Structure for AI Agents

Recommended project documentation structure:

```text
/docs
  /00_project_control
    00_MASTER_INDEX.md
    ai_agent_rules.md
    project_glossary.md
    decision_log.md
    changelog.md

  /01_product
    product_brief.md
    target_audience.md
    platform_strategy.md
    monetization_strategy.md
    market_research.md
    competitor_matrix.md

  /02_design
    game_design_document.md
    core_loop.md
    meta_progression.md
    feature_list.md
    mvp_scope.md
    balance_model.md
    economy_design.md
    level_design.md
    narrative_design.md

  /03_art_audio
    art_direction.md
    asset_pipeline.md
    animation_direction.md
    vfx_direction.md
    audio_direction.md

  /04_technical
    technical_architecture.md
    coding_standards.md
    data_schema.md
    save_system.md
    build_pipeline.md
    performance_budget.md

  /05_production
    production_roadmap.md
    task_breakdown.md
    milestone_plan.md
    risk_register.md
    sprint_plan.md

  /06_qa
    qa_plan.md
    test_cases.md
    bug_report_template.md
    regression_checklist.md
    performance_test_plan.md

  /07_release
    release_plan.md
    store_page_checklist.md
    marketing_plan.md
    launch_checklist.md
    legal_checklist.md

  /08_post_launch
    post_launch_roadmap.md
    feedback_tracker.md
    patch_notes.md
    community_report.md
```

---

# 16. Recommended Milestone Gates

## Gate 1 — Concept Approval

Required:

- Product brief
- Target audience
- Core loop
- Market comparison
- MVP scope

## Gate 2 — Prototype Approval

Required:

- Playable prototype
- Core fun validation
- Prototype feedback
- Risk assessment

## Gate 3 — Vertical Slice Approval

Required:

- Polished playable slice
- Final art direction sample
- Technical validation
- UX validation
- Production estimate

## Gate 4 — Alpha Approval

Required:

- Feature-complete build
- Full game playable
- Critical systems working
- Major blockers identified

## Gate 5 — Beta Approval

Required:

- Content complete
- Major bugs fixed
- Balance pass
- Store assets prepared

## Gate 6 — Release Candidate Approval

Required:

- Final build
- Store metadata
- QA pass
- Legal/platform checklist
- Hotfix plan

## Gate 7 — Launch Approval

Required:

- Public build live
- Monitoring ready
- Community channels ready
- First patch plan ready

---

# 17. Definition of Done

## Feature Done

A feature is done only when:

- It is implemented.
- It is documented.
- It is tested.
- It works with save/load if relevant.
- It works with UI if relevant.
- It has sound/visual feedback if relevant.
- It does not break existing systems.
- It is included in the changelog.

## Content Done

A content item is done only when:

- It exists in the game.
- It has final or approved asset quality.
- It is balanced.
- It is tested.
- It appears in the correct progression stage.
- It has localization text if required.
- It has no known critical issue.

## Build Done

A build is done only when:

- It launches successfully.
- It can start gameplay.
- It can exit cleanly.
- It can save/load if applicable.
- It passes smoke test.
- It has version number.
- It has changelog.
- It has known issues documented.

## Product Done

A game product is done only when:

- It is playable.
- It is stable.
- It is understandable.
- It has complete store assets.
- It has a release build.
- It has support plan.
- It has post-launch plan.
- It can be sold or distributed.

---

# 18. AI Agent Operating Rules

## General Rules

- Always read `00_MASTER_INDEX.md` first.
- Always check current milestone before starting work.
- Never expand scope without approval.
- Always update documentation after changing systems.
- Always write changelog entries for meaningful changes.
- Always maintain known issues.
- Always prefer small, testable tasks.
- Always separate prototype code from production code unless approved.
- Always protect release stability near launch.

## Implementation Rules

- Build foundation systems before content-heavy systems.
- Keep data configurable.
- Keep UI scalable.
- Keep save data versioned.
- Avoid hard-coded balance values.
- Avoid hidden dependencies.
- Log major errors clearly.
- Fail safely when possible.
- Optimize after correctness unless performance is core to the mechanic.

## Production Rules

- No feature is complete without testing.
- No milestone is complete without a build.
- No release is complete without store assets.
- No launch is complete without support plan.
- No post-launch roadmap is valid without player feedback.

---

# 19. Standard Task Template for AI Agents

```md
# Task: [Task Name]

## Objective
Explain what must be achieved.

## Context
Explain related systems, files, and design intent.

## Requirements
- Requirement 1
- Requirement 2
- Requirement 3

## Constraints
- Constraint 1
- Constraint 2

## Files To Modify
- path/to/file

## Acceptance Criteria
- Criteria 1
- Criteria 2
- Criteria 3

## Test Plan
- Test 1
- Test 2

## Documentation Update
- Document to update
```

---

# 20. Recommended First Command for AI Agent

Use this prompt when starting an AI coding agent:

```text
Read /docs/00_project_control/00_MASTER_INDEX.md first.
Then inspect the current project structure.
Identify the current milestone and compare the codebase against the milestone acceptance criteria.
Do not implement new features yet.
Create a status report with:
1. Current implemented systems
2. Missing systems
3. Broken or risky systems
4. Recommended next 10 tasks
5. Files that should be updated
```

---

# 21. Product Pipeline Summary

```text
1. Define the product.
2. Research the market.
3. Design the concept.
4. Prototype the core fun.
5. Build a vertical slice.
6. Plan production.
7. Produce all systems and content.
8. Reach alpha.
9. Polish through beta.
10. Prepare release candidate.
11. Launch the game.
12. Support and grow after launch.
```

A successful commercial game product is not finished when the game runs.  
It is finished when the product can be understood, bought, played, enjoyed, reviewed, supported, and improved.
