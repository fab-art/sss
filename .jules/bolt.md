## 2025-05-15 - [Memoizing SVG Components]
**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.

## 2026-07-07 - [Preventing Re-renders from Parent Inline Reductions]
**Learning:** Components that receive props derived from inline array operations (like `.reduce()` or `.map()`) in a parent's render loop will always re-render because they receive a new object reference every time. Wrapping these children in `React.memo` with a custom shallow comparison of the object properties is essential when the parent has high-frequency state updates (e.g., text input).
**Action:** Identify children receiving objects created "on the fly" in parent renders and implement `React.memo` with property-level comparison.
