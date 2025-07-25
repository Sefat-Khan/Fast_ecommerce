import { ClerkProvider } from "@clerk/nextjs";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "../context/AppContext";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "FastCart",
  description: "E-Commerce with Next.js ",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster />
          <AppContextProvider>{children}</AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
