import { useRestaurant } from "@/context/restaurant-context";

const filters = [
  { key: "showWorking", color: "bg-green-600", label: "Working" },
  { key: "showBroken", color: "bg-red-600", label: "Broken" },
  { key: "showUnknown", color: "bg-gray-500", label: "Unknown" },
] as const;

export default function MapKeyControl() {
  const { activeFilters, setFilter, stats } = useRestaurant();

  if (!stats?.total) return null;

  return (
    <ul className="map-overlay-control bg-white px-2 py-1 text-xs leading-5">
      {filters.map(({ key, color, label }) => (
        <li key={key} className="my-1">
          <button
            type="button"
            aria-pressed={activeFilters[key]}
            className={`flex w-full cursor-pointer items-center rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-100 ${
              activeFilters[key]
                ? ""
                : "bg-gray-200 opacity-50 line-through"
            }`}
            onClick={() => setFilter(key)}
          >
            <span className={`${color} mr-2 h-3 w-3 rounded-full`} />
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}
