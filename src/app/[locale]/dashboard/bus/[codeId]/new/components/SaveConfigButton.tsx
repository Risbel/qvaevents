"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export const SaveConfigButton = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveConfig = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically save the configuration to the database
    console.log("Saving configuration...");

    setIsSaving(false);
  };

  return (
    <Button variant="outline" className="cursor-pointer" size="sm" onClick={handleSaveConfig} disabled={isSaving}>
      <Save className="size-4" />
      {isSaving ? "Saving..." : "Save config"}
    </Button>
  );
};
