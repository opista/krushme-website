import { ReactNode } from "react";

export default function SiteHeader({ fixed = false, right, wide = false }: { fixed?: boolean; right?: ReactNode; wide?: boolean }) {
  return <header className={`border-b border-stone-200 bg-white ${fixed ? "fixed top-0 z-50 w-full max-w-7xl" : ""}`}><div className={`mx-auto flex items-center justify-between gap-4 px-4 py-4 ${wide ? "max-w-7xl" : "max-w-5xl"}`}><div><h1 className="font-friz font-bold italic text-lg uppercase text-kfc mb-0 leading-none"><a href="/">Krushme</a></h1><p className="p-0 leading-none text-sm">Is your local KFC Krushem machine broken?</p></div>{right}</div></header>;
}
