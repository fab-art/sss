## 2025-05-15 - [Memoizing SVG Components]
**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.

## 2026-06-06 - [Object Props and React.memo]
**Learning:** `React.memo` defaults to shallow reference equality for props. In this codebase, objects like `MuscleGrowth` are often derived or passed in ways that break reference equality even when values haven't changed.
**Action:** When memoizing components with object props, always provide a custom comparison function that performs a shallow check of the object's properties to ensure re-renders are truly prevented.
