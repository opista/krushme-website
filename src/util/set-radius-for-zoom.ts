export default function setRadiusForZoom(zoom: number) {
  if (zoom <= 7) return 3
  if (zoom <= 10) return 5
  if (zoom <= 12) return 10
  return 15
}