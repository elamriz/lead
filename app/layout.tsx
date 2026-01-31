import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundWrapper } from "@/components/ui/BackgroundWrapper";
import { CartDrawer } from "@/components/cart/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Elamriz | Premium Used PC Parts",
    template: "%s | Elamriz"
  },
  description: "High-quality refurbished PC components. Tested, certified, and ready to perform. GPU, CPU, Laptops and more.",
  keywords: ["PC parts", "used GPU", "refurbished CPU", "gaming PC", "cheap graphics cards", "Elamriz"],
  authors: [{ name: "Elamriz" }],
  creator: "Elamriz",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://elamriz.com",
    title: "Elamriz | Premium Used PC Parts",
    description: "High-quality refurbished PC components. Tested, certified, and ready to perform.",
    siteName: "Elamriz",
    images: [
      {
        url: "/og-image.jpg", // Nous devrons peut-être créer cette image plus tard
        width: 1200,
        height: 630,
        alt: "Elamriz - Premium Used PC Parts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elamriz | Premium Used PC Parts",
    description: "High-quality refurbished PC components. Tested, certified, and ready to perform.",
    images: ["/og-image.jpg"],
    creator: "@elamriz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <BackgroundWrapper>
          <Navbar />
          <div className="min-h-screen">
            {children}
          </div>
          <Footer />
          <CartDrawer />
        </BackgroundWrapper>
      </body>
    </html>
  );
}
