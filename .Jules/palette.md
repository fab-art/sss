## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-20 - Actionable Empty States
**Learning:** Replacing static "No data" messages with actionable CTA buttons (e.g., "Log your first meal") reduces friction and guides users directly into the core app loop. Using a dashed border and a large icon makes the target visually distinct and inviting.
**Action:** Always look for static empty states and convert them into actionable components that trigger the primary interaction for that view.
