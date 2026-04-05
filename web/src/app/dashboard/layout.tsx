import { Inter, Space_Grotesk } from "next/font/google";
import "../globals.css";
import DashboardClientLayout from "./DashboardClientLayout";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <DashboardClientLayout>{children}</DashboardClientLayout>
      </body>
    </html>
  );
}
