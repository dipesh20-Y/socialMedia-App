import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/ReactQueryProvider";
import Header from "./header/page";
import { MediaProvider } from "@/context/context";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <ReactQueryProvider>
      <html lang="en">
      <body className={`${inter.className} bg-[#D6D6D6]` }>
       <Header />
        {children}
        
        </body>
    </html>
    </ReactQueryProvider>
    
  );
}
