## 2025-05-15 - [Memoizing SVG Components]
**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.

## 2025-05-15 - [Shallow Comparison for Memoized Props]
**Learning:** When a component receives an object prop that is frequently recreated (e.g., derived in a parent's render), `React.memo` alone is insufficient as it only performs a shallow reference check. A custom comparison function that checks the object's primitive values is necessary to prevent redundant re-renders.
**Action:** Use custom comparison functions with `React.memo` when props are objects derived during parent rendering to ensure memoization effectiveness.
