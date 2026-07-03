## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Keyboard Efficiency for Manual Inputs
**Learning:** Manual numeric inputs in high-frequency interaction views (like workout logging) significantly benefit from 'Enter' key support (`onKeyDown`). This allows users to stay on the keyboard, reducing context switching and improving the overall flow of data entry.
**Action:** Implement `onKeyDown` with 'Enter' key support for all manual numeric entry fields.
