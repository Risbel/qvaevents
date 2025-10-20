"use client";

import Image from "next/image";
import { useThemeLogo } from "@/hooks/use-theme-logo";

const LogoIcon = ({ size = 30, className }: { size?: number; className?: string }) => {
  const logoSrc = useThemeLogo();

  return <Image src={logoSrc} alt="QvaEvents" width={size} height={size} priority className={className} />;
};

export default LogoIcon;
