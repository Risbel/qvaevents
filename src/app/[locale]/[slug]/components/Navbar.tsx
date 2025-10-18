"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from "react";

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const Navbar = ({
  businessLogo,
  initials,
  businessName,
}: {
  businessLogo: string;
  initials: string;
  businessName: string;
}): React.ReactNode => {
  return (
    <nav className="py-2 px-2 lg:px-4 sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b flex justify-between items-center snap-start">
      <a href="#hero" className="flex items-center gap-2" onClick={(e) => scrollToSection(e, "hero")}>
        <Avatar>
          <AvatarImage src={businessLogo as string} />
          <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <span className="text-primary font-semibold">{businessName}</span>
      </a>

      <div className="flex items-center gap-4">
        <a
          className="text-primary font-semibold hover:underline"
          href="#upcoming-events"
          onClick={(e) => scrollToSection(e, "upcoming-events")}
        >
          Events
        </a>

        <a
          className="text-primary font-semibold hover:underline"
          href="#contact"
          onClick={(e) => scrollToSection(e, "contact")}
        >
          Contact Us
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
