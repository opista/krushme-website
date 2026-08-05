import { ReactNode } from "react";

export default function SiteHeader({ fixed = false, right }: { fixed?: boolean; right?: ReactNode }) {
  return <header className={`border-b border-stone-200 bg-white ${fixed ? "fixed top-0 z-50 w-full max-w-7xl" : ""}`}><div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4"><div><h1 className="font-friz font-bold italic text-lg uppercase text-kfc mb-0 leading-none"><a href="/">Krushme</a></h1><p className="p-0 leading-none text-sm">Is your local KFC Krushem machine broken?</p></div>{right}</div></header>;
}
