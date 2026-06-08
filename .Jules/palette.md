## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2026-06-08 - Visual Feedback for Async Actions
**Learning:** Asynchronous actions (like 'Sync to Phase') require immediate visual confirmation. Using a temporary success state (e.g., changing button text to 'Synced' and adding a checkmark) provides a tactile, responsive feel that confirms the system processed the request.
**Action:** Implement a 2-second 'Success' state with icon feedback for non-navigational async buttons.
