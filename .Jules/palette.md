## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-20 - Asynchronous Interaction Feedback
**Learning:** For asynchronous actions like step syncing, providing immediate visual feedback (e.g., a temporary 'Synced' state with a checkmark) greatly improves perceived performance and reduces redundant clicks. Managing this state with `useState` and a `useEffect` cleanup timer is a reliable pattern for these micro-interactions.
**Action:** Implement temporary success states for one-off async actions to confirm completion to the user.
