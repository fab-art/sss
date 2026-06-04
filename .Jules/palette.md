## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-20 - Immediate Feedback for Asynchronous Actions
**Learning:** For asynchronous interactions (like syncing data or logging), setting the feedback state (e.g., `isSynced`, `isLoading`) *before* awaiting the promise is critical to prevent race conditions and accidental double-submissions. Combining this with a `useEffect` for cleanup ensures the UI remains consistent even if the component unmounts.
**Action:** Always transition to the active/loading state at the start of the handler, and use `useEffect` with `clearTimeout` for temporary status resets.
