## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2026-07-06 - Actionable Empty States
**Learning:** Transforming passive "empty" states into interactive components (buttons) significantly improves user engagement and reduces friction. By using a 'Plus' icon and premium styling (dashed borders, hover transitions), we prompt the user toward the primary action immediately.
**Action:** Always prefer actionable buttons over static text for empty list states to guide users toward their next step.
