## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Transient State Feedback with ARIA Live
**Learning:** For transient "success" states (like a 2-second 'Synced' confirmation), using `aria-live="polite"` combined with a dynamic `aria-label` ensures that screen reader users receive immediate confirmation of their action without being interrupted.
**Action:** When adding interaction feedback, pair visual changes with `aria-live` and context-aware ARIA labels.
