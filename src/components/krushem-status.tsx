import { KrushemMachineStatus } from "@/types";
import mapKrushemStatusToMeta from "@/util/map-krushem-status-to-meta";
import { KrushemIcon } from "./krushem-icon";

export default function KrushemStatus({
  status,
}: {
  status: KrushemMachineStatus;
}) {
  const statusMeta = mapKrushemStatusToMeta(status);
  return (
    <div className={`flex items-center gap-2 font-bold ${statusMeta.color}`}>
      <KrushemIcon className="w-3" />
      <span>{statusMeta.text}</span>
    </div>
  );
}
