// Styles
import "./globals.css";

// Types
import type { Metadata } from "next";

// Fonts
import { Inter, Poppins } from "next/font/google";

// Supabase
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { AuthProvider } from "@/context/AuthContext";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next.js x Supabase Template",
  description: "Generated with Next.js",
  authors: [{ name: "Santino Ventrice", url: "https://santiventri.com" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans` + ` ${poppins.variable} font-sans`}>
        <AuthProvider serverUser={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
