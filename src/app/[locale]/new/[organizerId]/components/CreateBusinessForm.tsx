"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Building2, Plus } from "lucide-react";
import { createBusiness } from "@/actions/business/createBusiness";
import { State } from "@/types/state";
import { useParams } from "next/navigation";

interface CreateBusinessFormProps {
  organizerId: number;
  organizerName: string;
}

export default function CreateBusinessForm({ organizerId, organizerName }: CreateBusinessFormProps) {
  const t = useTranslations("Business");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const initialState: State = { status: undefined };
  const [state, formAction, isPending] = useActionState(createBusiness, initialState);
  const [slug, setSlug] = useState("");

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setSlug(generateSlug(name));
  };

  useEffect(() => {
    if (state.status === "success") {
      toast.success(t("createSuccess"));
      router.push(`/${locale}/profile`);
    } else if (state.status === "error") {
      toast.error(t("createError"));
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          <CardTitle>{t("createBusiness")}</CardTitle>
        </div>
        <CardDescription>
          {t("createBusinessDescription")} {organizerName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("businessName")} *</Label>
            <Input
              id="name"
              name="name"
              placeholder={t("businessNamePlaceholder")}
              required
              onChange={handleNameChange}
              className={state.errors?.name ? "border-destructive" : ""}
            />
            {state.errors?.name && <p className="text-xs text-destructive">{state.errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={t("descriptionPlaceholder")}
              rows={4}
              className={state.errors?.description ? "border-destructive" : ""}
            />
            {state.errors?.description && <p className="text-xs text-destructive">{state.errors.description[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">{t("slug")} *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={t("slugPlaceholder")}
                required
                className={state.errors?.slug ? "border-destructive" : ""}
              />
            </div>
            <p className="text-xs text-muted-foreground">{t("slugDescription")}</p>
            {state.errors?.slug && <p className="text-xs text-destructive">{state.errors.slug[0]}</p>}
          </div>

          <input id="organizerId" name="organizerId" type="hidden" value={organizerId} required />

          <div className="flex justify-center items-center">
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("creating")}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {t("createBusiness")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
