## 2025-05-15 - Layout Stability during List Transitions
**Learning:** Using `AnimatePresence` with `mode="popLayout"` in list components (like Nutrition Log) prevents the sudden "jump" of subsequent items when one is removed. This maintains the user's visual anchor and provides a much more polished, tactile feel.
**Action:** Always prefer `mode="popLayout"` for list item deletions to ensure stable layout transitions.

## 2025-05-16 - Async Feedback for Action Buttons
**Learning:** In highly interactive components like NutritionTracker, providing immediate visual feedback for async operations (e.g., logging a meal) via loading spinners and disabled states prevents duplicate submissions and reduces user uncertainty. Using a dedicated `isLogging` state makes this pattern easily manageable.
**Action:** Implement `isLogging` state and `Loader2` icons for all primary async action buttons to ensure a responsive and reliable feel.
