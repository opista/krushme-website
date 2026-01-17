## 2026-01-16 - Mutating Props via Sort
**Learning:** Found `Array.prototype.sort()` being used directly on a prop array inside a component's render body. This mutates the prop in-place, which violates React's immutability principles and can lead to unpredictable bugs and order inconsistencies across re-renders.
**Action:** When finding max/min values, use `reduce` or a loop (O(N)) instead of `sort` (O(N log N)). If sorting is required, always copy the array first (`[...arr].sort()`).

## 2026-02-14 - Mirroring Props in State
**Learning:** Found a Context Provider mirroring props (`restaurants`, `stats`) into local state variables (`unFilteredRestaurants`, `statsData`) using `useEffect`. This causes an unnecessary double-render cycle (Props Change -> Render -> Effect -> State Update -> Re-render) and duplicates data in memory.
**Action:** Remove the state and `useEffect`. Derive values directly from props (e.g., using `useMemo`) to ensure downstream consumers receive updates immediately in the same render cycle.
