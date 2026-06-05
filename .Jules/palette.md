## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-20 - Instant Feedback for Asynchronous Actions
**Learning:** For actions like syncing or saving that happen in the background, providing immediate visual confirmation (e.g., changing button text to 'Synced' with a checkmark) for a short duration (2s) significantly reduces user anxiety and prevents duplicate clicks.
**Action:** Use a temporary success state for asynchronous actions that don't result in an immediate, obvious UI change.
