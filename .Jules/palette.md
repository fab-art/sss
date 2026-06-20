## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-20 - Actionable Empty States
**Learning:** Static empty states (e.g., "No data found") are missed opportunities for engagement. Transforming them into large, actionable buttons with hover states and icons significantly reduces friction for first-time or daily interactions.
**Action:** Always design empty states as prominent call-to-action elements that trigger the primary feature of the view.
