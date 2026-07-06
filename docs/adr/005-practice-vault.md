# ADR 005: Practice Vault Learning Memory Layer

## Status
Approved

## Context
Account Executives need a permanent brain that stores discovery and mock logs. This shouldn't be simple flat files or basic lists; every call must be indexable, searchable, and comparative.

## Decision
We implement a unified Session Memory architecture in the **Practice Vault**.
- Extended storage payload: We add `anchor`, `timeline`, `collections`, `tags`, `pinned`, `archived`, `privateNotes`, and `reflection` keys directly to the `Session` domain object.
- Event integration: The SessionManager publishes type-safe events (`session:opened`, `session:pinned`, `session:archived`, `session:deleted`, `session:viewed`) to capture exact user timeline transitions.
- Collections: We implement folder grouping. A session references folder tags in a string array (`collections`), enabling multi-folder indexing.

## Consequences
- **Pros**:
  - Extremely queryable. Matches the "GitHub for sales sessions" concept.
  - Keeps business logic separated. Feature modules read and write raw session structures.
- **Cons**:
  - Increases local storage object size. Requires managing collection folder indices.
