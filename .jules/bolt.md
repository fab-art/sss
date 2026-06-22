## 2025-05-15 - [Memoizing SVG Components]
**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.

## 2025-05-16 - [Zustand useShallow and useMemo for Derived Objects]
**Learning:** Destructuring multiple values from a Zustand store without `useShallow` causes the component to re-render whenever ANY part of the store state changes, even if the selected values remain the same. Furthermore, creating new object references for derived data (like physique growth calculations) on every render invalidates `React.memo` in children.
**Action:** Use `useShallow` for multi-value store selection and wrap derived object/array calculations in `useMemo` to stabilize references for child components.
