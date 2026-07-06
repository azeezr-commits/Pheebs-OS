# ADR 001: Decoupled Type-Safe Event Bus

## Status
Approved

## Context
Features in Pheebs Core (Analyzer, Mock Call, Live Call, Coach, Vault) need to update timelines, trigger coaching whispers, calculate scores, and update playbook rules based on user actions. Directly coupling these features would make the platform hard to extend and test.

## Decision
We implement a type-safe Event Bus in the core layer (`src/core/event-bus/EventBus.ts`). 
- Instead of direct function calls, modules publish and subscribe to a central set of event topics.
- Events are defined as strict TypeScript mappings, ensuring compile-time validation of payload shapes.

## Consequences
- **Pros**: 
  - Complete decoupling. Features like `Academy` can listen to `session:closed` events to generate drills without the `MockCall` engine ever knowing the academy exists.
  - Testability. We can mock any feature by subscribing to events in tests and asserting payloads.
- **Cons**:
  - Requires maintaining a global event map.
  - Asynchronous event handlers can make control flows less obvious than direct calls if not properly documented.
