## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Immediate Feedback for Asynchronous Actions
**Learning:** Asynchronous actions like "Syncing" benefit greatly from an immediate visual confirmation (e.g., 'Synced' text and checkmark icon) that persists for a short duration. This prevents redundant user clicks and provides a tactile sense of accomplishment for even background operations.
**Action:** Use temporary success states (useState + useEffect cleanup) for key asynchronous user interactions to confirm completion and improve perceived performance.
