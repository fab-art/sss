## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Actionable Empty States
**Learning:** Transforming static empty states into interactive call-to-action buttons (like in the Nutrition Log) significantly reduces friction and guides users toward the next logical step. Using visual cues like dashed borders and plus icons helps distinguish these from standard list items.
**Action:** Use `motion.button` for empty state placeholders to make them actionable, and include appropriate hover/focus states for accessibility.
