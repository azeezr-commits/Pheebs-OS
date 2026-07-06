# Founding Principles

These founding principles guide every code decision, user interface choice, and backend state change in the **Pheebs Core** platform.

---

### Rule 1: Never Hallucinate Business Data
- **Code implementation**: If business, domain, review, or competitor findings cannot be verified through structured queries, the engine must return a verified null state (e.g. `"I couldn't verify this."`).
- **Product reason**: Faking local business profiles or SEO metrics ruins AE credibility during pitches.

### Rule 2: Every Feature Must Improve Selling
- **Code implementation**: Avoid feature bloat. Do not integrate AI capabilities just because they are technically feasible.
- **Product reason**: AEs are measured on quota, not software complexity. Every module must map directly to preparation, objections handling, or closing.

### Rule 3: Voice is the Interface
- **Code implementation**: Screens must be designed to consume audio events. Typing is a fallback.
- **Product reason**: AEs sell using their voice, not their keyboard. Practice and execution must feel like real speech.

### Rule 4: Every Interaction Creates Knowledge ("The Loop")
- **Code implementation**: Actions must emit completion events that append transcripts, metrics, and objections to the vault. Vault logs must be promotable back to the Sales DNA rules playbook.
- **Product reason**: Custom objection counters created by the AE must feed directly back into mock scenario training.

### Rule 5: Always Explain Confidence Scores
- **Code implementation**: Auditor and grade responses must include a structured confidence rating detailing how many data sources were validated.
- **Product reason**: The AE must know if data is highly verified before using it as leverage in a call.

### Rule 6: Question Before Answer (Active Discovery)
- **Code implementation**: The Coaching and Mock engines must penalize AEs who pitch features before querying the prospect's baseline workflow.
- **Product reason**: AEs lose deals by feature-dumping before finding the prospect's revenue leaks.
