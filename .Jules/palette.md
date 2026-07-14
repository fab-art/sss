## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Keyboard Efficiency in Numeric Inputs
**Learning:** Manual numeric inputs (like reps or GPS distance) often leave the keyboard open or focus stuck after entry on mobile/web. Implementing an `onKeyDown` handler that triggers `blur()` on 'Enter' provides a natural "completion" interaction that matches user expectations and streamlines the data entry flow.
**Action:** Always pair manual numeric inputs with 'Enter-to-blur' logic to improve keyboard navigation efficiency.
