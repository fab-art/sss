## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Keyboard Commitment for Manual Inputs
**Learning:** Manual numeric inputs (like reps/distance) feel sluggish if they only update on blur. Adding an `onKeyDown` handler for the "Enter" key provides immediate feedback and matches user expectations for form-like interactions, significantly improving the "speed of thought" for data entry.
**Action:** Always pair `onBlur` commitment with an `onKeyDown` (Enter) handler for manual numeric entries.
