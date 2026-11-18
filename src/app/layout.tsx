import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata, Viewport } from "next";
import { Prompt } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AccentProvider } from "@/components/accent-provider";
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

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#181a1d" },
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: [
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
          <body className={`${prompt.variable} font-sans antialiased`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <AccentProvider>
                <a href="#main" className="skip-link">
                  ข้ามไปยังเนื้อหาหลัก
                </a>
                <NuqsAdapter>
                  <TooltipProvider>{children}</TooltipProvider>
                </NuqsAdapter>
                <Toaster />
              </AccentProvider>
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
