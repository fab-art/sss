## 2025-05-15 - [Memoizing SVG Components]
**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.

## 2025-05-16 - [Zustand Store Computation Caching]
**Learning:** In Zustand, getter-style functions (like `getSummary`) that perform derived calculations (e.g., TDEE, macro targets) can cause performance issues if called directly in component renders, as they are recalculated every time. Internal caching within the store's closure, comparing against stable dependencies (meal entries, user profile), significantly reduces CPU load and prevents unnecessary re-renders of components using that data.
**Action:** Implement internal caching/memoization for expensive derived data getters in stores that are consumed by high-frequency components like the Dashboard.
