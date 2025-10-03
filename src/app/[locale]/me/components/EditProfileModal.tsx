"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useActionState } from "react";
import { updateProfile } from "@/actions/profile/updateProfile";
import { State } from "@/types/state";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface ClientProfile {
  id: number;
  username: string;
  info: string | null;
  birthday: string | null;
  sex: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  user_id: string;
}

interface EditProfileModalProps {
  clientProfile: ClientProfile;
}

export default function EditProfileModal({ clientProfile }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("ClientProfile.EditProfileModal");
  const tActions = useTranslations("actions");
  // Format birthday for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const [birthday, setBirthday] = useState(formatDateForInput(clientProfile.birthday));

  const initialState: State = { status: undefined };
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(t("updateSuccess"));
      setIsOpen(false);
      router.refresh();
    } else if (state.status === "error") {
      toast.error(t("updateError"));
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-end">
        <DialogTrigger asChild>
          <Button className="cursor-pointer" variant="outline" size="sm">
            <Edit className="h-4 w-4" />
            {tActions("edit")}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("edit")}</DialogTitle>
          <DialogDescription>{t("editDescription")}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={clientProfile.id} />
          <input type="hidden" name="birthday" value={birthday ? new Date(birthday).toISOString() : ""} />

          <div className="space-y-2">
            <Label htmlFor="username">{t("username")}</Label>
            <Input
              id="username"
              name="username"
              readOnly
              defaultValue={clientProfile.username || ""}
              placeholder={t("usernamePlaceholder")}
              required
            />
            {state?.errors?.username && <p className="text-sm text-destructive">{state.errors.username}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="info">{t("bio")}</Label>
            <Textarea
              id="info"
              name="info"
              defaultValue={clientProfile.info || ""}
              placeholder={t("bioPlaceholder")}
              rows={3}
            />
            {state?.errors?.info && <p className="text-sm text-destructive">{state.errors.info}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthday">{t("birthday")}</Label>
            <Input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full"
            />
            {state?.errors?.birthday && <p className="text-sm text-destructive">{state.errors.birthday}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">{t("gender")}</Label>
            <Select name="sex" defaultValue={clientProfile.sex || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {state?.errors?.sex && <p className="text-sm text-destructive">{state.errors.sex}</p>}
          </div>

          {state?.errors?.profile && <p className="text-sm text-destructive">{state.errors.profile}</p>}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              {tActions("cancel")}
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {tActions("saving")}
                </>
              ) : (
                tActions("save")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
