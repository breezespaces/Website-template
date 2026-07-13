import type { Metadata } from "next";
import { Azeret_Mono, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AppProvider from "@/lib/app-provider";
import { getTenantInfo } from "@/api/requests/auth";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"] });

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-azeret-mono",
  display: "swap",
});

export const generateMetadata = async (): Promise<Metadata> => {
  try {
    const response = await getTenantInfo();
    const {
      data: { business_name },
    } = response;
    return {
      title: business_name,
    };
  } catch (error) {
    return {
      title: "Breezespaces User Storefront",
    };
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} ${azeretMono.variable} antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
