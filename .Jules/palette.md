## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Interaction Feedback and Actionable Empty States
**Learning:** For asynchronous operations like logging data, users need immediate feedback to feel confident the app is working. Implementing an `isLogging` state that toggles a spinner and disables the button prevents double-submissions and reduces perceived latency. Additionally, converting static empty states into large, interactive buttons provides a clear path forward for new users, reducing friction in the core app loop.
**Action:** Implement loading spinners for all async primary actions and ensure every empty state serves as a functional shortcut to its associated action.
