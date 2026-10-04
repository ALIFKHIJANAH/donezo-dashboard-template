# Graph Report - Dashboard-Template  (2026-10-04)

## Corpus Check
- 13 files · ~4,361 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 23 nodes · 11 edges · 1 communities detected
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 1|Community 1]]

## God Nodes (most connected - your core abstractions)
1. `submit()` - 2 edges
2. `login()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `submit()` --calls--> `login()`  [INFERRED]
  src/AuthPage.tsx → src/lib/auth.ts

## Communities

### Community 1 - "Community 1"
Cohesion: 0.67
Nodes (2): login(), submit()

## Knowledge Gaps
- **Thin community `Community 1`** (3 nodes): `login()`, `submit()`, `AuthPage.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `login()` connect `Community 1` to `Community 3`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._