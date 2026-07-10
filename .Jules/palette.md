## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Manual Input Commitment via Enter Key
**Learning:** Manual numeric inputs significantly benefit from supporting the 'Enter' key to commit changes. By triggering `blur()` on 'Enter', we can fire existing `onBlur` handlers and dismiss the on-screen keyboard, creating a much more efficient keyboard-driven UX.
**Action:** Always implement `onKeyDown` with 'Enter' support for manual numeric inputs that use `onBlur` for committing data to ensure a smooth interaction flow.
