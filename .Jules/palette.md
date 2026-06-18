## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Keyboard Efficiency for Numeric Inputs
**Learning:** Manual numeric inputs (like repetitions or weight) are friction points in fitness logging. Supporting the 'Enter' key (`onKeyDown`) to commit changes provides a much more responsive feel and aligns with standard desktop/keyboard user expectations, reducing reliance on manual "Save" button clicks or focus loss.
**Action:** Ensure all manual numeric entry fields implement `onKeyDown` handlers for the 'Enter' key to commit values.
