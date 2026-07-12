import type { Metadata } from "next";
import { Caveat, Fraunces, Plus_Jakarta_Sans, Cairo } from "next/font/google";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mosiqti — Chansons personnalisées sur mesure",
  description:
    "Offrez une chanson unique, écrite et enregistrée à partir de votre histoire. Le cadeau le plus personnel pour vos proches.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const isRtl = locale === 'ar' || locale === 'ma';
  const dir = isRtl ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fraunces.variable} ${plusJakarta.variable} ${caveat.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col bg-background text-foreground ${isRtl ? 'font-cairo' : 'font-sans'}`}>
        <NextIntlClientProvider messages={messages}>
          <PromoBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
