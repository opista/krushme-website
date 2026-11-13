import "@/styles/globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { Rokkitt } from "next/font/google";

const rokkitt = Rokkitt({
  weight: "800",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-rokkitt-google",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rokkitt.variable}>
      <body>{children}</body>
    </html>
  );
}
