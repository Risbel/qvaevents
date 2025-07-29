import { ReactNode } from "react";
import { Navigation } from "./components/Navigation";

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">{children}</main>
    </div>
  );
}
