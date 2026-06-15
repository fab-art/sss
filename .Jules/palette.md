## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-24 - Interaction Feedback for Async Operations
**Learning:** Asynchronous actions like "Sync to Phase" should provide immediate visual confirmation and temporary success states. Using a combination of 'syncing' and 'synced' states with a checkmark icon significantly improves perceived responsiveness and user confidence.
**Action:** Implement a temporary success state (e.g., 2 seconds) with a checkmark and updated ARIA labels for any critical manual synchronization or logging action.
