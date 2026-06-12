## 2025-05-15 - Layout Stability during List Transitions

**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Explicit Feedback for Async Interactions

**Learning:** For asynchronous operations triggered by a button (e.g., syncing steps), providing a temporary visual "Success" state (text change + icon) combined with `aria-live="polite"` ensures both sighted and screen-reader users receive immediate confirmation of the action's completion.
**Action:** Implement a 2-second success state for async interaction buttons with appropriate ARIA labels and live regions.
