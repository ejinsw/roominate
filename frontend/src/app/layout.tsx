import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { cookies } from "next/headers";
import { Header } from "@/components/global/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roominate",
  description: "Find roommates online!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  const getUser = async () => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token");

      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });

      const data = await res.json();

      if (!data) return;

      user = data.user;
    } catch (error) {
      console.log(error);
    }
  };

  await getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider initialUser={user}>
          <Header className="sticky top-0 z-10"/>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
