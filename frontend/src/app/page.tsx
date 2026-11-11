import { AboutSection } from "@/components/about/AboutSection";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ContactSection } from "@/components/contact/ContactSection";
import { FaqSection } from "@/components/faq/FaqSection";
import { Footer } from "@/components/footer/Footer";
import { VideoScene } from "@/components/video-scene/VideoScene";
import type { LandingResponse } from "@/domain/catalog";
import { apiGet } from "@/infrastructure/api/client";

export default async function HomePage() {
  let landing: LandingResponse | null = null;

  try {
    landing = await apiGet<LandingResponse>("/landing");
  } catch {
    landing = null;
  }

  if (landing === null || landing.escenas.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-ink px-6 text-center text-brand-cream">
        <div className="max-w-md space-y-3">
          <h1 className="flex justify-center font-display text-4xl">
            <BrandLogo variant="on-dark" />
          </h1>
          <p className="text-sm opacity-80">
            La vitrina está tomando un descanso. Vuelve a intentarlo en unos minutos.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main id="inicio">
      <VideoScene tienda={landing.tienda} escenas={landing.escenas} />
      <AboutSection />
      <FaqSection />
      <ContactSection tienda={landing.tienda} />
      <Footer tienda={landing.tienda} />
    </main>
  );
}
