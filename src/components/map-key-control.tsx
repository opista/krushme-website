import { useRestaurant } from "@/context/restaurant-context";
import leaflet from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const createListItem = (
  container: HTMLElement,
  color: string,
  text: string,
  onClick: () => void
) => {
  const item = leaflet.DomUtil.create(
    "li",
    "my-1 border rounded-md border-gray-300 hover:bg-gray-100 cursor-pointer",
    container
  );
  item.innerHTML = `<button class="flex items-center w-full py-2 px-3"><div class="${color} w-3 h-3 rounded-full mr-2"></div> ${text}</button>`;
  leaflet.DomEvent.disableClickPropagation(item);
  leaflet.DomEvent.on(item, "click", () => {
    item.classList.toggle("opacity-50");
    item.classList.toggle("bg-gray-200");
    item.classList.toggle("line-through");
    onClick();
  });

  return item;
};

export default function MapKeyControl() {
  const map = useMap();
  const { setFilter, stats } = useRestaurant();

  useEffect(() => {
    if (!stats?.total) return;

    const KeyControl = leaflet.Control.extend({
      options: {
        position: "topright",
      },
      onAdd: function () {
        const container = leaflet.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control bg-white"
        );
        const keyList = leaflet.DomUtil.create("ul", "py-1 px-2", container);
        createListItem(keyList, "bg-green-600", "Working", () =>
          setFilter("showWorking")
        );
        createListItem(keyList, "bg-red-600", "Broken", () =>
          setFilter("showBroken")
        );
        createListItem(keyList, "bg-gray-500", "Unknown", () =>
          setFilter("showUnknown")
        );

        return container;
      },
      onRemove: function () {},
    });

    const control = new KeyControl();
    map.addControl(control);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  return null;
}
