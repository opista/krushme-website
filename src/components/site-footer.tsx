import Link from "next/link";

export default function SiteFooter({
  fixed = false,
  showHistory = false,
}: {
  fixed?: boolean;
  showHistory?: boolean;
}) {
  const linkClassName = "inline-flex items-center px-1.5 py-2 text-sm font-bold leading-none underline hover:underline-offset-2 sm:px-3 sm:py-3";

  return <footer className={`border-t border-stone-200 bg-white h-11 ${fixed ? "fixed bottom-0 z-50 max-w-7xl w-full" : "mt-auto w-full"}`}><div className={`mx-auto flex h-full items-center justify-end px-4 ${fixed ? "max-w-7xl" : "max-w-5xl"}`}><div className="flex items-center">{showHistory ? <><Link className={linkClassName} href="/stats">Machine stats</Link><span aria-hidden="true" className="h-4 w-px bg-stone-300 sm:h-5" /></> : null}<a className={linkClassName} href="https://www.buymeacoffee.com/opista" rel="nofollow" target="_blank">Buy me a Krushem ❤</a><span aria-hidden="true" className="h-4 w-px bg-stone-300 sm:h-5" /><a className={linkClassName} href="mailto:krushme@opista.com">Contact</a></div></div></footer>;
}
