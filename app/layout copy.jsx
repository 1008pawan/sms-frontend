import "./globals.css";
import { Toaster } from "react-hot-toast";
import QueryProvider from "../app/Providers/QueryProvider";
import ClientLoader from "./ClientLoader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://smshospitalgkp.vercel.app/";
const TITLE = "SMS Hospital | Gorakhpur";
const DESC =
  "Gorakhpur's most trusted hospital, where advanced technology and expert specialists come together to provide world-class treatment.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "SMS Hospital",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "SMS Hospital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/images/og-banner.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <QueryProvider>
          <Toaster position="top-right" />
          <ClientLoader>{children}</ClientLoader>
        </QueryProvider>
      </body>
    </html>
  );
}
