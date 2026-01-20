## 2026-01-16 - Mutating Props via Sort
**Learning:** Found `Array.prototype.sort()` being used directly on a prop array inside a component's render body. This mutates the prop in-place, which violates React's immutability principles and can lead to unpredictable bugs and order inconsistencies across re-renders.
**Action:** When finding max/min values, use `reduce` or a loop (O(N)) instead of `sort` (O(N log N)). If sorting is required, always copy the array first (`[...arr].sort()`).

## 2026-02-14 - Mirroring Props in State
**Learning:** Found a Context Provider mirroring props (`restaurants`, `stats`) into local state variables (`unFilteredRestaurants`, `statsData`) using `useEffect`. This causes an unnecessary double-render cycle (Props Change -> Render -> Effect -> State Update -> Re-render) and duplicates data in memory.
**Action:** Remove the state and `useEffect`. Derive values directly from props (e.g., using `useMemo`) to ensure downstream consumers receive updates immediately in the same render cycle.

## 2026-03-01 - Optimizing GitHub Gist Data Fetching
**Learning:** Found sequential API calls (fetch commits -> fetch raw file) to get the latest Gist content. Attempted to optimize by using the direct `raw` URL (`gist.githubusercontent.com/.../raw/filename`).
**Outcome:** REJECTED. The raw URL is cached by GitHub's CDN (up to 5 mins), but the application requires the absolute latest version immediately.
**Action:** Do NOT remove the commit hash lookup. The sequential fetch is necessary to bypass CDN caching and guarantee data freshness.

## 2026-03-05 - Object Literal Allocations in Render Loops
**Learning:** Found a utility function `mapKrushemStatusToMeta` returning new object literals on every call. Used inside a list rendering loop (Markers), this breaks referential equality checks (even with `React.memo`), causing unnecessary re-renders and increased GC pressure.
**Action:** Extract static return values into module-level constants (using `as const` for immutability). This ensures O(1) allocation and stable references, allowing downstream components to skip re-renders effectively.
