import { KrushemMachineStatus } from "@/types"

const STATUS_META_MAP = {
  [KrushemMachineStatus.Working]: {
    imageUrl: "/drink_working.png",
    color: 'text-green-600',
    colorRgb: 'rgb(22, 163, 74)',
    text: 'Krushem machine is working',
  },
  [KrushemMachineStatus.Broken]: {
    imageUrl: "/drink_broken.png",
    color: 'text-red-600',
    colorRgb: 'rgb(220, 38, 38)',
    text: 'Krushem machine is broken',
  },
  [KrushemMachineStatus.Unknown]: {
    imageUrl: "/drink_unknown.png",
    color: 'text-gray-500',
    colorRgb: 'rgb(107, 114, 128)',
    text: 'Krushem machine status unknown',
  },
} as const;

export default function mapKrushemStatusToMeta (status: KrushemMachineStatus) {
  return STATUS_META_MAP[status] ?? STATUS_META_MAP[KrushemMachineStatus.Unknown];
}
