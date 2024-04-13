import { KrushemMachineStatus } from "@/types"

export default function mapKrushemStatusToMeta (status: KrushemMachineStatus) {
  switch (status) {
    case KrushemMachineStatus.Working:
      return {
        imageUrl: "/drink_working.png",
        color: 'text-green-600',
        colorRgb: 'rgb(22, 163, 74)',
        text: 'Krushem machine is working',
      }
    case KrushemMachineStatus.Broken:
      return {
        imageUrl: "/drink_broken.png",
        color: 'text-red-600',
        colorRgb: 'rgb(220, 38, 38)',
        text: 'Krushem machine is broken',
      }
    case KrushemMachineStatus.Unknown:
    default:
      return {
        imageUrl: "/drink_unknown.png",
        color: 'text-gray-500',
        colorRgb: 'rgb(107, 114, 128)',
        text: 'Krushem machine status unknown',
      }
  }
}