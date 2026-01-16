## 2026-01-16 - Mutating Props via Sort
**Learning:** Found `Array.prototype.sort()` being used directly on a prop array inside a component's render body. This mutates the prop in-place, which violates React's immutability principles and can lead to unpredictable bugs and order inconsistencies across re-renders.
**Action:** When finding max/min values, use `reduce` or a loop (O(N)) instead of `sort` (O(N log N)). If sorting is required, always copy the array first (`[...arr].sort()`).
