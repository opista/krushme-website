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
**Action:** Extract static return values into module-level constants (using `as const` for immutability). This ensures O(1) allocation and stable references, allowing downstream components to skip re-renders effectively. Use a constant lookup object (map) instead of a switch statement for O(1) access and cleaner code.

## 2026-03-06 - Optimizing Time-Dependent Rendering
**Learning:** Creating `DateTime` objects in loops or frequently called render functions is expensive (Intl API overhead). Lifting the "current time" (`now`) to a parent component and passing it down improved rendering performance by ~40% (1500ms -> 900ms for 4000 calls).
**Action:** Identify time-dependent data (e.g., "Open/Closed" status) and hoist the `now` object creation. Use a hook (like `useCurrentTime`) to control the update frequency (e.g., every 60s) instead of creating a new timestamp on every render. This allows for batch updates and memoization stability.

## 2026-03-08 - Hoisting Redundant Utility Calls
**Learning:** Found `getStoreStatus` calling `getOpeningAndClosingTimes` multiple times (3x) for the same inputs within a single execution. This multiplied the cost of `DateTime` operations (Intl API) significantly.
**Action:** Identify helper functions that are called multiple times with the same arguments. Calculate the result once in the parent and pass it down as an optional argument (dependency injection), ensuring to check for `undefined` (not truthiness) if the result can be null.

## 2026-03-09 - Memoizing DateTime Creation
**Learning:** `DateTime.fromObject` (or `.set()`) in Luxon is expensive (~48µs). In high-frequency render loops (e.g. 1000 items x 4 calls/item = 4000 calls), this blocks the main thread.
**Action:** Use `WeakMap` to memoize utility functions that produce `DateTime` objects, especially when inputs (like `now`) change frequently but the output is stable based on the date part only.
