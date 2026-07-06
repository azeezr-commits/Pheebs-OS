# ADR 002: Session-Centric Architecture

## Status
Approved

## Context
Every workflow an AE performs (analyzing a prospect, mock training, active live calls, coach playgrounds) is conversational, stateful, and creates historical records. Managing these differently per module duplicates state logic and metrics calculation.

## Decision
We establish the **Session Engine** as the core pipeline of Pheebs Core.
- Every interaction starts as a `Session` with states: `Draft` | `Active` | `Paused` | `Completed` | `Archived`.
- The `SessionManager` tracks active session instances, records dialogue sequences, and writes records to the storage abstraction.
- Sub-modules register as handlers or consumers of specific session types.

## Consequences
- **Pros**:
  - Consistent ledger. All actions produce a unified, replayable historical object.
  - State persistence. An AE can pause a session and resume it later, solving real-world interruptions.
- **Cons**:
  - Requires wrapping all features in a session context wrapper.
  - Adds structure overhead to simpler features (e.g. simple SEO analysis).
