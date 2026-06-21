## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-24 - Keyboard Efficiency for Numeric Inputs
**Learning:** Adding `onKeyDown` handlers for "Enter" to manual numeric inputs bridges the gap between touch-optimized UI and desktop/keyboard efficiency, making the app feel more robust and professional for power users.
**Action:** Always pair manual numeric entry fields with an "Enter" key listener to trigger the primary save/commit action.
