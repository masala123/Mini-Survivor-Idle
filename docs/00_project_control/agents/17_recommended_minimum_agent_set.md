# Recommended Minimum Agent Set

For early development, use only the essential agents.

## Minimum Agents

1. Lead Game Director Agent
2. Technical Architect Agent
3. Survivor AI Designer Agent
4. Gameplay Programmer Agent
5. UI/UX Designer Agent
6. Economy & Balance Designer Agent
7. QA / Test Agent
8. Documentation Agent

## Why This Set

This set covers:

- Vision
- Architecture
- AI behavior
- Gameplay implementation
- Player readability
- Balance
- Testing
- Documentation

## First Codex Task

```text
Read docs/agents/AGENTS.md, docs/agents/00_AGENT_ROLE_INDEX.md, and all linked role documents.
Then inspect the current project structure.
Create a development plan for MVP 1 based on the agent roles and existing design docs.
Do not implement yet.
```

## First Implementation Task

```text
Implement MVP 1 foundation:
- simulation tick
- single survivor entity
- hunger stat
- day/night timer
- resource nodes
- click assistance
- basic AI task selection

Keep simulation separate from rendering.
Update docs after implementation.
Add basic tests.
```
