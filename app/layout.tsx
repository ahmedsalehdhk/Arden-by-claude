import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://arden-by-claude.vercel.app"; // TODO: swap to the production domain once live
const SITE_NAME = "Arden Holdings Ltd";
const SITE_TITLE = "Arden Holdings Ltd — Legacy In Every Landmark";
const SITE_DESCRIPTION =
  "Arden Holdings Ltd. — a legacy of luxury residential developments across Dhaka. Featuring the country's most selective projects, we deliver an uncompromising standard of quality, craftsmanship, and trust.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Arden Holdings Ltd",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Arden Holdings",
    "Arden Holdings Ltd",
    "real estate Dhaka",
    "luxury apartments Dhaka",
    "Banani real estate",
    "Jolshiri real estate",
    "Alliance-Arden Consortium",
    "Bangladesh property developer",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    // opengraph-image.png in /app is picked up automatically by Next.js
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // twitter-image.png in /app is picked up automatically
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} ${openSans.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
