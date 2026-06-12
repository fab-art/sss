## 2025-05-15 - [Memoizing SVG Components]

**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.

## 2026-06-12 - [Closure-based Memoization in Zustand]
**Learning:** Complex getters in Zustand stores (like `getSummary`) that are called frequently during re-renders can be optimized by using a simple reference-based cache within the store's factory closure. This avoids expensive recalculations of derived data (e.g., TDEE and macro targets) without needing a full-blown selector library for simple cases.
**Action:** Use a closure-scoped cache variable in the store definition to memoize expensive derived state getters when inputs remain referentially identical.
