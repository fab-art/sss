## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Actionable Empty States
**Learning:** Replacing static "No data" text with an actionable component (like a button with a `Plus` icon and dashed borders) significantly reduces friction. It transforms a dead-end into a clear next step, making the UI feel more proactive and helpful.
**Action:** Use actionable empty states for primary features to guide users toward engagement.
