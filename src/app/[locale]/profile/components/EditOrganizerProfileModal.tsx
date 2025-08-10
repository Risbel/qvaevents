"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Building, Edit } from "lucide-react";
import { updateOrganizerProfile } from "@/actions/auth/updateOrganizerProfile";
import { State } from "@/types/state";
import { useRouter } from "next/navigation";

interface OrganizerProfile {
  id: number;
  isDeleted: boolean;
  isActive: boolean;
  updatedAt: string;
  user_id: string;
  createdAt: string;
  companyName: string;
  companyType: string;
  companyLogo: string;
}

interface EditOrganizerProfileModalProps {
  profile: OrganizerProfile;
}

export default function EditOrganizerProfileModal({ profile }: EditOrganizerProfileModalProps) {
  const t = useTranslations("Profile");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const initialState: State = { status: undefined };
  const [state, formAction, isPending] = useActionState(updateOrganizerProfile, initialState);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(t("updateSuccess"));
      setIsOpen(false);
      router.refresh();
    } else if (state.status === "error") {
      toast.error(t("updateError"));
    }
  }, [state, router]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          {t("edit")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            {t("editProfile")}
          </DialogTitle>
          <DialogDescription>{t("editDescription")}</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">{t("companyName")} *</Label>
              <Input
                id="companyName"
                name="companyName"
                defaultValue={profile.companyName}
                placeholder={t("companyNamePlaceholder")}
                required
                className={state.errors?.companyName ? "border-destructive" : ""}
              />
              {state.errors?.companyName && <p className="text-sm text-destructive">{state.errors.companyName[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyType">{t("companyType")} *</Label>
              <Input
                id="companyType"
                name="companyType"
                defaultValue={profile.companyType}
                placeholder={t("companyTypePlaceholder")}
                required
                className={state.errors?.companyType ? "border-destructive" : ""}
              />
              {state.errors?.companyType && <p className="text-sm text-destructive">{state.errors.companyType[0]}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("saveChanges")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
