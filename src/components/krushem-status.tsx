import { KrushemMachineStatus } from "@/types";
import mapKrushemStatusToMeta from "@/util/map-krushem-status-to-meta";
import Image from "next/image";

export default function KrushemStatus({
  status,
}: {
  status: KrushemMachineStatus;
}) {
  const statusMeta = mapKrushemStatusToMeta(status);
  return (
    <div className={`flex align-center font-bold ${statusMeta.color}`}>
      <Image
        alt="A krushem icon"
        className="mr-2"
        src={statusMeta.imageUrl}
        width={10}
        height={17}
      />
      <span>{statusMeta.text}</span>
    </div>
  );
}
