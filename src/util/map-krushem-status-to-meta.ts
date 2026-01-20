import { KrushemMachineStatus } from "@/types"

// Constants defined outside the function to avoid object reallocation on every call.
// Using 'as const' ensures immutability since these are shared references.
const WORKING_META = {
  imageUrl: "/drink_working.png",
  color: 'text-green-600',
  colorRgb: 'rgb(22, 163, 74)',
  text: 'Krushem machine is working',
} as const;

const BROKEN_META = {
  imageUrl: "/drink_broken.png",
  color: 'text-red-600',
  colorRgb: 'rgb(220, 38, 38)',
  text: 'Krushem machine is broken',
} as const;

const UNKNOWN_META = {
  imageUrl: "/drink_unknown.png",
  color: 'text-gray-500',
  colorRgb: 'rgb(107, 114, 128)',
  text: 'Krushem machine status unknown',
} as const;

export default function mapKrushemStatusToMeta (status: KrushemMachineStatus) {
  switch (status) {
    case KrushemMachineStatus.Working:
      return WORKING_META;
    case KrushemMachineStatus.Broken:
      return BROKEN_META;
    case KrushemMachineStatus.Unknown:
    default:
      return UNKNOWN_META;
  }
}
