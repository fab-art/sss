## 2025-05-15 - [Memoizing SVG Components]
**Learning:** Complex SVG components with multiple motion paths and conditional styling can be expensive to re-render. In a parent component with frequent state updates (like range inputs or selects), memoizing these visual components significantly reduces total render time and improves UI responsiveness.
**Action:** Always check if complex SVG or animation-heavy components can be wrapped in `React.memo` if they are children of components with frequent state updates.

## 2025-05-16 - [Coordinated Memoization for High-Frequency Inputs]
**Learning:** Performance wins in high-frequency input scenarios (like typing in a text field) require a coordinated approach between parent and child. Memoizing a child (e.g., `MuscleGraphic`) is ineffective if the parent passes a new object literal on every render.
**Action:** Use `useMemo` in the parent to stabilize object references passed to memoized children, and ensure `useMemo` hooks are declared before early returns to maintain consistent hook order.
