import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata, Viewport } from "next";
import { Anuphan } from "next/font/google";
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

const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["latin", "thai"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0b12" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f7" },
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
          <body className={`${anuphan.variable} font-sans antialiased`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <AccentProvider>
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
