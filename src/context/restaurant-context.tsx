import { KrushemMachineStatus, RestaurantData, RestaurantStats } from "@/types";
import {
  createContext,
  JSX,
  useContext,
  useMemo,
  useState,
} from "react";

type RestaurantContext = {
  restaurants: RestaurantData[];
  stats: RestaurantStats | null;
  setFilter: (filter: keyof FilterState) => void;
};

type FilterState = {
  showWorking: boolean;
  showBroken: boolean;
  showUnknown: boolean;
};

const RestaurantContext = createContext<RestaurantContext>({
  restaurants: [],
  stats: { working: 0, broken: 0, unknown: 0, total: 0 },
  setFilter: () => {},
});

function RestaurantProvider({
  children,
  restaurants,
  stats,
}: {
  children: JSX.Element;
  restaurants: RestaurantData[];
  stats: RestaurantStats | null;
}) {
  const [filters, setFilters] = useState<FilterState>({
    showWorking: true,
    showBroken: true,
    showUnknown: true,
  });

  const setFilter = (filter: keyof FilterState) =>
    setFilters((originalFilters) => ({
      ...originalFilters,
      [filter]: !originalFilters[filter],
    }));

  const { showWorking, showBroken, showUnknown } = filters;
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      if (
        !showWorking &&
        restaurant.krushemMachineStatus === KrushemMachineStatus.Working
      )
        return false;
      if (
        !showBroken &&
        restaurant.krushemMachineStatus === KrushemMachineStatus.Broken
      )
        return false;
      if (
        !showUnknown &&
        restaurant.krushemMachineStatus === KrushemMachineStatus.Unknown
      )
        return false;

      return true;
    });
  }, [restaurants, showWorking, showBroken, showUnknown]);

  const value = {
    restaurants: filteredRestaurants,
    setFilter,
    stats,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a RestaurantProvider");
  }
  return context;
}

export { RestaurantProvider, useRestaurant };
