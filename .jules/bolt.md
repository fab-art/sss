## 2025-05-15 - [Memoizing SVG Components]
**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.

## 2026-06-18 - [Optimizing Complex SVG Rendering]
**Learning:** For performance-heavy components like SVGs that depend on objects (e.g., `MuscleGrowth`), simply wrapping in `React.memo` is insufficient if the parent recreates the object prop on every render.
**Action:** Always combine `useMemo` at the call-site for prop reference stability with `React.memo` (and a custom comparison function for deep/shallow equality) on the component itself to eliminate redundant renders in high-frequency update paths like workout timers.
