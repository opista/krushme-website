import Link from "next/link";

export default function SiteFooter({
  fixed = false,
  showHistory = false,
}: {
  fixed?: boolean;
  showHistory?: boolean;
}) {
  const linkClassName = "inline-flex items-center whitespace-nowrap px-1 py-2 text-xs font-bold leading-none underline hover:underline-offset-2 sm:px-3 sm:py-3 sm:text-sm";

  return <footer className={`border-t border-stone-200 bg-white h-11 ${fixed ? "fixed bottom-0 z-50 w-full" : "mt-auto w-full"}`}><div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4"><a className="shrink-0 rounded-sm text-base font-black tracking-wide bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-600 focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:outline-none sm:text-xl" href="https://opista.com/?utm_source=krushme&utm_medium=referral&utm_campaign=footer&utm_content=opista-logo" rel="noopener noreferrer" target="_blank">OPISTA</a><div className="flex items-center">{showHistory ? <><Link className={linkClassName} href="/stats">Machine stats</Link><span aria-hidden="true" className="h-4 w-px bg-stone-300 sm:h-5" /></> : null}<a className={linkClassName} href="https://www.buymeacoffee.com/opista" rel="nofollow" target="_blank">Buy me a Krushem ❤</a><span aria-hidden="true" className="h-4 w-px bg-stone-300 sm:h-5" /><a className={linkClassName} href="mailto:krushme@opista.com">Contact</a></div></div></footer>;
}
