import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Mea_Culpa } from "next/font/google";

import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const meaCulpa = Mea_Culpa({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mea-culpa",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Carise | Vitrina inmersiva",
    template: "%s | Carise",
  },
  description:
    "Vitrina inmersiva de la tienda de ropa Carise: descubre cada prenda en video y compra por WhatsApp.",
  applicationName: "Carise",
  keywords: ["Carise", "ropa de mujer", "prendas de punto", "algodón", "vitrina inmersiva"],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "Carise",
    title: "Carise | Vitrina inmersiva",
    description:
      "Descubre la nueva colección de Carise en una vitrina inmersiva y compra por WhatsApp.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "Carise, nueva colección de prendas de punto en algodón",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carise | Vitrina inmersiva",
    description:
      "Descubre la nueva colección de Carise en una vitrina inmersiva y compra por WhatsApp.",
    images: ["/brand/og-image.png"],
  },
  icons: {
    icon: "/brand/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${meaCulpa.variable}`}>
      <body className="bg-brand-cream text-brand-ink antialiased">{children}</body>
    </html>
  );
}
