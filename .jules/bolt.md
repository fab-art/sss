## 2025-05-15 - [Memoizing SVG Components]
**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.

## 2025-05-20 - [Avoiding Micro-Optimizations in Dashboard]
**Learning:** Memoizing simple arithmetic or derived values in components (like level progress or calorie percentages) is often a micro-optimization that adds more boilerplate and risk than actual performance gain. It can also lead to stale data if store getter functions (e.g., `getSummary`) are used as dependencies without proper stability.
**Action:** Only use `useMemo` for truly expensive computations. Prioritize memoization for complex visual components like `MuscleGraphic` (SVGs) where the re-render cost is demonstrably high.
