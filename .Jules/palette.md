## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-20 - Keyboard Efficiency for Manual Inputs
**Learning:** For numeric manual inputs that use `onBlur` for data persistence, users instinctively expect the 'Enter' key to commit their change and dismiss the keyboard (especially on mobile). Adding a simple `onKeyDown` listener that triggers `blur()` provides a much more responsive and "app-like" feel.
**Action:** Always implement 'Enter' key to `blur()` on manual numeric inputs to ensure intuitive data entry and keyboard dismissal.
