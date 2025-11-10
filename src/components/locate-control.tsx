import setRadiusForZoom from "@/util/set-radius-for-zoom";
import storage from "@/util/storage";
import leaflet from "leaflet";
import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

export default function LocateControl() {
  const map = useMapEvents({
    locationfound(e) {
      map.eachLayer((layer) => {
        if (layer.options.pane === "tooltipPane") {
          layer.removeFrom(map);
        }
      });
      map.flyTo(e.latlng, 11);
    },
    moveend() {
      const center = map.getCenter();
      const zoom = map.getZoom();
      storage.updateSettings({ center, zoom });
    },
    zoomend() {
      const center = map.getCenter();
      const zoom = map.getZoom();
      storage.updateSettings({ center, zoom });

      const radius = setRadiusForZoom(zoom);

      map.eachLayer((layer) => {
        if (layer instanceof leaflet.CircleMarker) {
          layer.setRadius(radius);
        }
      });
    },
  });

  useEffect(() => {
    const LocateButton = leaflet.Control.extend({
      options: {
        position: "topleft",
      },
      onAdd: function () {
        const container = leaflet.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
        );
        const button = leaflet.DomUtil.create(
          "a",
          "leaflet-control-button cursor-pointer flex! justify-center items-center",
          container
        );
        button.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="16" height="16" viewBox="0 0 474.27 474.27"><path d="M237.135 474.27c130.968 0 237.135-106.167 237.135-237.135S368.103 0 237.135 0 0 106.167 0 237.135 106.167 474.27 237.135 474.27zM60.639 200.556C75.197 130.212 130.87 74.742 201.32 60.485v65.557h73.157V60.81c69.727 14.753 124.7 69.914 139.161 139.746h-66.167v73.157h66.167c-14.453 69.833-69.434 124.993-139.161 139.746v-65.232H201.32v65.557c-70.45-14.266-126.123-69.727-140.681-140.072h66.167v-73.157H60.639z" style="fill:#010002"/><circle cx="239.842" cy="237.135" r="18.964" style="fill:#010002"/></svg>';
        leaflet.DomEvent.disableClickPropagation(button);
        leaflet.DomEvent.on(button, "click", () => map.locate());

        container.title = "Locate me";

        return container;
      },
      onRemove: function () {},
    });

    const button = new LocateButton();
    map.addControl(button);
  }, [map]);

  return null;
}
