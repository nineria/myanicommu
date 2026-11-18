import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata, Viewport } from "next";
import {
  Archivo_Black,
  IBM_Plex_Sans_Thai,
  Prompt,
  Work_Sans,
} from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AccentProvider } from "@/components/accent-provider";
import { AuthSync } from "@/components/auth-sync";
import { PreferencesProvider } from "@/components/preferences-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME } from "@/lib/constants";
import { TRPCReactProvider } from "@/trpc/client";

import "./globals.css";

// The Clerk instance is shared with other apps, so its application name ("Chatterbox") is overridden here.
const clerkLocalization = {
  signIn: {
    start: {
      title: "Sign in to MyAniCommu",
      titleCombined: "Sign in to MyAniCommu",
    },
  },
  signUp: {
    start: {
      title: "Create your MyAniCommu account",
      titleCombined: "Create your MyAniCommu account",
    },
  },
};

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      {
        url: "/my-anime-community-logo-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/my-anime-community-logo-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  },
  openGraph: { images: ["/background.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{ theme: shadcn }}
      localization={clerkLocalization}
    >
      <TRPCReactProvider>
        <html lang="th" suppressHydrationWarning>
          <body
            className={`${plexThai.variable} ${prompt.variable} ${archivo.variable} ${workSans.variable} font-sans antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <AccentProvider>
                <PreferencesProvider>
                  <AuthSync />
                  <a href="#main" className="skip-link">
                    ข้ามไปยังเนื้อหาหลัก
                  </a>
                  <NuqsAdapter>
                    <TooltipProvider>{children}</TooltipProvider>
                  </NuqsAdapter>
                  <Toaster />
                </PreferencesProvider>
              </AccentProvider>
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
