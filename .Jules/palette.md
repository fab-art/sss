## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-15 - Async Interaction Feedback Pattern
**Learning:** Asynchronous actions (like step synchronization) benefit from a temporary success state (e.g., 'Synced' text + checkmark) to provide immediate confirmation. Crucially, the success state should be triggered *after* the operation's promise resolves to ensure accurate feedback, while accessibility is maintained via `aria-live="polite"` and descriptive `aria-label` updates.
**Action:** Use `useState` for transient success states and `useEffect` for cleanup; ensure accurate sequencing with `await`.
