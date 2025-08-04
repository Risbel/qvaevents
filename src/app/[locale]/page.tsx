import { useTranslations } from "next-intl";
import MainNav from "./components/MainNav";

export default function Home() {
  const t = useTranslations("Index");

  return (
    <div className="min-h-screen">
      <MainNav />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
        <div className="absolute inset-0 grid grid-cols-2 -z-10 opacity-10">
          <div className="bg-gradient-to-br from-primary/20 blur-2xl" />
          <div className="bg-gradient-to-bl from-foreground/20 blur-2xl" />
        </div>

        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-3">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{t("hero.description")}</p>
          <div className="flex gap-4 justify-center">
            <a
              href="#features"
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("hero.cta.primary")}
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-full border border-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {t("hero.cta.secondary")}
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t("features.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="p-4 md:p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition hover:shadow-md animate-in fade-in"
              >
                <h3 className="text-xl font-semibold mb-3">{t(`features.cards.${i}.title`)}</h3>
                <p className="text-muted-foreground">{t(`features.cards.${i}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">{t("contact.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t("contact.description")}</p>
          <a
            href="mailto:risbel961019@gmail.com"
            className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t("contact.cta")}
          </a>
        </div>
      </section>
    </div>
  );
}
