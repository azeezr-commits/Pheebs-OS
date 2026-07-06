# ADR 003: Storage Abstraction Layer

## Status
Approved

## Context
Pheebs Core needs to load and save plays, sessions, templates, and metrics. Using `localStorage` directly in feature modules binds the application logic to a local browser environment, making server/cloud integration (e.g. Postgres, Supabase, Firebase) difficult later.

## Decision
We introduce an abstract `Storage` contract (`src/contracts/Storage.ts`) using async Promise-based signatures.
- Feature engines write to and read from the contract, not the global window window state.
- In Phase 0, we implement `LocalStorageAdapter` conforming to the contract.
- Future upgrades can substitute the adapter with Supabase or Firestore services without rewriting business code.

## Consequences
- **Pros**:
  - Future-proof. Simple DB integrations.
  - Testability. Easy memory-based mocks.
- **Cons**:
  - Adds async/await handling requirements for local retrieval.
