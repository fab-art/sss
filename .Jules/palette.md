## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-20 - Actionable Empty States
**Learning:** Converting static "No data" messages into actionable buttons (e.g., in NutritionTracker) significantly improves discoverability and reduces friction by providing a direct path to the primary action. It transforms a "dead end" into a helpful starting point.
**Action:** Audit list-based views for static empty states and replace them with actionable, icon-assisted call-to-action buttons.
