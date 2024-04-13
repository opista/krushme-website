const getMetaForStatus = (isOpen: boolean | null) => {
  if (isOpen) return {
    text: 'Open',
    color: 'text-green-600'
  }

  if (isOpen === false) return {
    text: 'Closed',
    color: 'text-red-600'
  }

  return {
    text: 'Unavailable',
    color: 'text-gray-500'
  }
}

export default function OpenOrClosed({ isOpen }: { isOpen: boolean | null }) {
  const { text, color } = getMetaForStatus(isOpen)
  return <span className={`font-bold ${color}`}>{text}</span>;
};