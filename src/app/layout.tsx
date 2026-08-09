import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getConfig } from "@/lib/db";
import { getIconUrl } from "@/lib/icons";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const config = getConfig();
  return {
    title: {
      default: config.site_name,
      template: `%s - ${config.site_name}`,
    },
    description: config.site_description,
    // 留空时回落到 public/icon.svg（内置默认图标）
    icons: { icon: config.site_icon ? getIconUrl(config.site_icon) : "/icon.svg" },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning data-scroll-behavior="smooth" className={GeistMono.variable}>
      <body className="antialiased font-mono">
        <ThemeProvider>
          {children}
          <Toaster position="top-center" duration={1500} />
        </ThemeProvider>
      </body>
    </html>
  );
}
