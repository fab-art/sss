## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-06-29 - Actionable Empty States for Engagement
**Learning:** Replacing static "No data" messages with actionable buttons (using dashed borders and clear CTAs) significantly improves the "cold start" experience. It reduces friction by guiding users directly into the core interaction loop (e.g., logging fuel) without them needing to search for the primary action button.
**Action:** Implement actionable empty states for all core feature lists that start empty to drive immediate user interaction.
