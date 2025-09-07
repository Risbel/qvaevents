"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface MetaTagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export const MetaTagsInput = ({ value, onChange }: MetaTagsInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations("EventCreation");

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("basicInfo.keywordsPlaceholder")}
          className="max-w-xs"
        />
        <Button
          className="cursor-pointer"
          type="button"
          onClick={addTag}
          disabled={!inputValue.trim()}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <Badge key={index} variant="default" className="flex items-center gap-2 py-1 pr-1">
              {tag}
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="cursor-pointer rounded-full size-4"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
