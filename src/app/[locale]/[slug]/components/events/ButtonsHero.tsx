"use client";

import React from "react";
import { useTranslations } from "next-intl";

const ButtonsHero = () => {
  const t = useTranslations("BusinessLanding");

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <a
        className="border border-primary py-1 min-w-28 text-center bg-primary/50 hover:bg-primary/60 hover:text-white backdrop-blur-sm text-white"
        href="#upcoming-events"
        onClick={(e) => scrollToSection(e, "upcoming-events")}
      >
        {t("events")}
      </a>

      <a
        className="border border-primary py-1 min-w-28 text-center bg-accent/20 hover:bg-accent/30 hover:text-white backdrop-blur-sm text-white"
        href="#contact"
        onClick={(e) => scrollToSection(e, "contact")}
      >
        {t("contact")}
      </a>
    </div>
  );
};

export default ButtonsHero;
