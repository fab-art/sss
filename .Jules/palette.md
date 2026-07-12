## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-20 - Manual Input Commitment via Keyboard
**Learning:** For numeric inputs where state is committed on blur (like `WorkoutLogger` or `GpsTracker`), users intuitively expect the 'Enter' key to save their changes. Explicitly handling `onKeyDown` to trigger `blur()` provides a seamless transition from keyboard entry to data persistence without requiring a mouse click.
**Action:** Always implement Enter-to-blur for manual numeric inputs in progression trackers.
