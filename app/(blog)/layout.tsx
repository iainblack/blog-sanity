import "@/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { VisualEditing, toPlainText } from "next-sanity";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import AlertBanner from "../../components/alert-banner";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SettingsQueryResponse, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import 'aos/dist/aos.css';
import AOSInitializer from "@/components/AosInitializer";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SettingsQueryResponse>({
    query: settingsQuery,
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`bg-default-bg text-text-primary`}>
      {draftMode().isEnabled && <VisualEditing />}
      <body>
        <section className="min-h-screen flex flex-col">
          {draftMode().isEnabled && <AlertBanner />}
          <AOSInitializer />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </section>
        <SpeedInsights />
      </body>
    </html>
  );
}
