import "@/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Metadata } from "next";
import { VisualEditing, toPlainText } from "next-sanity";
import { EB_Garamond } from "next/font/google";
import { draftMode } from "next/headers";
import AlertBanner from "../../components/CMS-Banner";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SettingsQueryResponse, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import 'aos/dist/aos.css';
import AOSInitializer from "@/components/AosInitializer";
import FirebaseAnalytics from "@/components/Firebase/FirebaseClientConfig";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SettingsQueryResponse>({
    query: settingsQuery,
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
    icons: {
      icon: [
        { url: '/images/favicon.ico', sizes: 'any', type: 'image/x-icon' },
        { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
    },
  };
}

const garamond = EB_Garamond({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${garamond.className}bg-default-bg text-text-primary`}>
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
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
