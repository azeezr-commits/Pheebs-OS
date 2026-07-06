# Pheebs Core Vision

## Mission
To build the foundation of **Pheebs Core**—the operating system that every Account Executive (AE) opens before, during, and after every customer conversation to win more deals.

## Core Principles
1. **AE-Centric Workflow**: Every component exists to solve a specific, high-value step in the sales preparation, execution, reflection, and learning cycle. If it does not directly help an AE close deals, it is noise.
2. **Decoupled Architecture**: Features must exist as independent packages communicating asynchronously. The core is a container; features plug into core contracts.
3. **Data-driven Playbooks**: Wisdom is compiled into structured playbooks rather than simple chat windows.
4. **The Loop Mechanics**: Every conversation logs session metrics. These sessions create new knowledge, which writes directly back to Sales DNA, updating mock roleplay scenarios and coaching suggestions. The system gets smarter because it was used, not because the code changed.

```
Preparation (Business Analyzer)
     │
     ▼
Execution (Mock / Live Call)
     │
     ▼
Reflection (Practice Vault)
     │
     ▼
Knowledge (Sales DNA)
     │
     ▼
Improvement (Academy Drills)
```

## Non-Goals for V1
- Building general-purpose AI chat assistants.
- Replacing CRMs or calendars (we are the conversational coaching layer above them).
- Automating sales messaging/email campaigns.
