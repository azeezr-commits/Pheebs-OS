# ADR 004: Boundary Separation (Core, Domain, Features)

## Status
Approved

## Context
As codebase scope increases, features can easily bleed into each other, resulting in circular dependencies and complex module refactoring.

## Decision
We enforce a strict three-tier layout layer:
1. **Contracts** (`src/contracts/`): Abstract interfaces. No module can import concrete modules; they can only depend on these contracts.
2. **Core** (`src/core/`): Foundational utilities (EventBus, Storage, SessionEngine). They are feature-agnostic.
3. **Domain** (`src/domain/`): Core data structures, enums, rules (Session transitions, prospect archetypes, sales playbooks).
4. **Features** (`src/features/`): Custom modules implementing specific workflows. They read from contracts and domains, communicate via the EventBus, and are isolated.

## Consequences
- **Pros**:
  - High extensibility. A feature can be completely deleted or replaced without compiling failures in unrelated modules.
  - High clean interface compliance.
- **Cons**:
  - Requires maintaining folder strictness and import lint restrictions.
