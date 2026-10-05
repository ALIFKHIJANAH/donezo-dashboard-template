# Graph Report - Dashboard-Template  (2026-10-04)

## Corpus Check
- 18 files · ~10,323 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 32 nodes · 15 edges · 1 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]

## God Nodes (most connected - your core abstractions)
1. `submit()` - 2 edges
2. `login()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `submit()` --calls--> `login()`  [INFERRED]
  src/AuthPage.tsx → src/lib/auth.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.33
Nodes (2): login(), submit()

## Knowledge Gaps
- **Thin community `Community 0`** (6 nodes): `getUser()`, `login()`, `logout()`, `submit()`, `AuthPage.tsx`, `auth.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._