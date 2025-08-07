"use client";

import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import ModeToggle from "@/app/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Button asChild variant="outline" size="icon" className="absolute left-4 top-4">
        <Link href="/">
          <Home />
        </Link>
      </Button>
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <LocaleSwitcher />
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md p-6 shadow-lg">{children}</Card>
    </div>
  );
};

export default AuthLayout;
