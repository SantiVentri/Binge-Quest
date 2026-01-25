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
import { ToastProvider } from "@/context/ToastContext";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Binge Quest | by Santino Ventrice",
  description: "Are you a true TV and movie expert? Play Binge Quest and challenge your memory with our trivia minigames. 🎬🍿 Start playing now!",
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
        <ToastProvider>
          <AuthProvider serverUser={user}>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
