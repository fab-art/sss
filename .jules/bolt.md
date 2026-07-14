## 2025-05-15 - [Memoizing SVG Components]
**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.

## 2025-05-23 - [Zustand Store Methods and Re-renders]
**Learning:** Components calling store methods that derive data (like `getSummary` in `useNutritionStore`) trigger those calculations on every render. Because these methods often use `useUserStore.getState()` internally, they don't automatically trigger re-renders when the *other* store changes.
**Action:** Use selective selectors for state, and wrap derived data methods in `useMemo` with dependencies on the specific state slices they consume (e.g., `mealEntries`, `protocol`, AND the external `profile`) to ensure efficiency and correctness.
