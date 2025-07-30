import Link from "next/link";
import { Calendar, Users, Palette, Globe, BarChart, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function LandingPage() {
  const t = await getTranslations("landing");

  return (
    <div className="flex flex-col gap-12 md:gap-20 pb-12 md:pb-20 px-4 md:px-16">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[80vh] md:h-[90vh] flex items-center pt-8 md:pt-0">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 animate-in fade-in slide-in-from-left duration-800">
              {t("hero.title", { brand: "QvaEvent" })}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 animate-in fade-in slide-in-from-left duration-1000 delay-200">
              {t("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-left duration-1000 delay-300">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition text-lg font-medium text-center"
              >
                {t("hero.startTrial")}
              </Link>
              <Link
                href="#demo"
                className="px-6 py-3 rounded-lg border border-border hover:bg-accent transition text-lg font-medium text-center"
              >
                {t("hero.requestDemo")}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-gradient-to-l from-primary/20 to-transparent -z-10 hidden md:block" />
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto scroll-mt-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 animate-in fade-in">
          {t("features.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard
            icon={<Calendar className="w-6 md:w-8 h-6 md:h-8" />}
            title={t("features.cards.eventPlanning.title")}
            description={t("features.cards.eventPlanning.description")}
          />
          <FeatureCard
            icon={<Users className="w-6 md:w-8 h-6 md:h-8" />}
            title={t("features.cards.clientManagement.title")}
            description={t("features.cards.clientManagement.description")}
          />
          <FeatureCard
            icon={<Palette className="w-6 md:w-8 h-6 md:h-8" />}
            title={t("features.cards.customBranding.title")}
            description={t("features.cards.customBranding.description")}
          />
          <FeatureCard
            icon={<Globe className="w-6 md:w-8 h-6 md:h-8" />}
            title={t("features.cards.virtualEvents.title")}
            description={t("features.cards.virtualEvents.description")}
          />
          <FeatureCard
            icon={<BarChart className="w-6 md:w-8 h-6 md:h-8" />}
            title={t("features.cards.analytics.title")}
            description={t("features.cards.analytics.description")}
          />
          <FeatureCard
            icon={<Shield className="w-6 md:w-8 h-6 md:h-8" />}
            title={t("features.cards.security.title")}
            description={t("features.cards.security.description")}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="container mx-auto">
        <div className="bg-accent rounded-xl md:rounded-2xl p-6 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">{t("cta.title")}</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <Link
            href="/signup"
            className="px-6 md:px-8 py-3 md:py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition text-lg font-medium inline-block w-full sm:w-auto"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4 md:p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition hover:shadow-md animate-in fade-in">
      <div className="mb-4 text-primary transition-transform">{icon}</div>
      <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground">{description}</p>
    </div>
  );
}
