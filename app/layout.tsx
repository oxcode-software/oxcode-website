import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oxcodesoftware.com"),
  title: {
    default: "Oxcode Software Solutions LLP | Scalable Web & Mobile Apps",
    template: "%s | Oxcode Software Solutions LLP",
  },
  description:
    "Oxcode Software Solutions LLP builds scalable mobile apps, web solutions, and digital products with modern UI/UX and long-term support.",
  keywords: [
    "Software Development",
    "Mobile Apps",
    "Web Solutions",
    "Digital Products",
    "UI/UX Design",
    "Custom Software",
    "Oxcode",
  ],
  authors: [{ name: "Oxcode Software Solutions LLP" }],
  creator: "Oxcode Software Solutions LLP",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oxcodesoftware.com",
    title: "Oxcode Software Solutions LLP | Scalable Web & Mobile Apps",
    description:
      "Oxcode Software Solutions LLP builds scalable mobile apps, web solutions, and digital products with modern UI/UX and long-term support.",
    siteName: "Oxcode Software Solutions",
    images: [
      {
        url: "/og-image.jpg", // Create this image in public/ folder
        width: 1200,
        height: 630,
        alt: "Oxcode Software Solutions LLP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oxcode Software Solutions LLP | Scalable Web & Mobile Apps",
    description:
      "Oxcode Software Solutions LLP builds scalable mobile apps, web solutions, and digital products with modern UI/UX and long-term support.",
    creator: "@oxcodesoftware",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
