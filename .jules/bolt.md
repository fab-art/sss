## 2025-05-15 - [Memoizing SVG Components]
**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.
