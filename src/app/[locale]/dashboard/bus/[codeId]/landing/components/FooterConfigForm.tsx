"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { updateBusinessFooter } from "@/actions/business/updateBusinessFooter";
import { FooterConfigType } from "@/lib/validations/footer";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface Phone {
  id: string;
  number: string;
}

interface Email {
  id: string;
  address: string;
}

interface SocialNetwork {
  id: string;
  type: "instagram" | "facebook" | "twitter" | "linkedin" | "youtube" | "tiktok" | "whatsapp" | "telegram";
  url: string;
}

interface QuickLink {
  id: string;
  name: string;
  url: string;
}

interface FooterConfig {
  phones: Phone[];
  emails: Email[];
  locationText: string;
  socialNetworks: SocialNetwork[];
  quickLinks: QuickLink[];
}

interface FormErrors {
  [key: string]: string[];
}

const socialNetworkTypes = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
];

const FooterConfigForm = ({
  footerConfig,
  businessId,
}: {
  footerConfig: FooterConfigType | null;
  businessId: number;
}) => {
  const t = useTranslations("Business");
  const queryClient = useQueryClient();
  const { codeId } = useParams<{ codeId: string }>();
  const [config, setConfig] = useState<FooterConfig>({
    phones: footerConfig?.phones?.map((phone) => ({ id: phone.id, number: phone.number })) || [{ id: "1", number: "" }],
    emails: footerConfig?.emails?.map((email) => ({ id: email.id, address: email.address })) || [
      { id: "1", address: "" },
    ],
    locationText: footerConfig?.locationText || "",
    socialNetworks:
      footerConfig?.socialNetworks?.map((social) => ({
        id: social.id,
        type: social.type,
        url: social.url,
      })) || [],
    quickLinks: footerConfig?.quickLinks?.map((link) => ({ id: link.id, name: link.name, url: link.url })) || [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const addPhone = () => {
    const newPhone: Phone = {
      id: Date.now().toString(),
      number: "",
    };
    setConfig((prev) => ({
      ...prev,
      phones: [...prev.phones, newPhone],
    }));
  };

  const removePhone = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      phones: prev.phones.filter((phone) => phone.id !== id),
    }));
  };

  const updatePhone = (id: string, number: string) => {
    // Clean the phone number: trim and remove all spaces
    const cleanNumber = number.trim().replace(/\s+/g, "");

    setConfig((prev) => ({
      ...prev,
      phones: prev.phones.map((phone) => (phone.id === id ? { ...phone, number: cleanNumber } : phone)),
    }));
  };

  const addEmail = () => {
    const newEmail: Email = {
      id: Date.now().toString(),
      address: "",
    };
    setConfig((prev) => ({
      ...prev,
      emails: [...prev.emails, newEmail],
    }));
  };

  const removeEmail = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      emails: prev.emails.filter((email) => email.id !== id),
    }));
  };

  const updateEmail = (id: string, address: string) => {
    // Clean the email address: trim and remove all spaces
    const cleanAddress = address.trim().replace(/\s+/g, "");

    setConfig((prev) => ({
      ...prev,
      emails: prev.emails.map((email) => (email.id === id ? { ...email, address: cleanAddress } : email)),
    }));
  };

  const addSocialNetwork = () => {
    const newSocial: SocialNetwork = {
      id: Date.now().toString(),
      type: "instagram",
      url: "",
    };
    setConfig((prev) => ({
      ...prev,
      socialNetworks: [...prev.socialNetworks, newSocial],
    }));
  };

  const removeSocialNetwork = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      socialNetworks: prev.socialNetworks.filter((social) => social.id !== id),
    }));
  };

  const updateSocialNetwork = (id: string, field: keyof SocialNetwork, value: string) => {
    const cleanUrl = value.trim().replace(/\s+/g, "");
    setConfig((prev) => ({
      ...prev,
      socialNetworks: prev.socialNetworks.map((social) =>
        social.id === id ? { ...social, [field]: cleanUrl } : social
      ),
    }));
  };

  const addQuickLink = () => {
    const newLink: QuickLink = {
      id: Date.now().toString(),
      name: "",
      url: "",
    };
    setConfig((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, newLink],
    }));
  };

  const removeQuickLink = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((link) => link.id !== id),
    }));
  };

  const updateQuickLink = (id: string, field: keyof QuickLink, value: string) => {
    const cleanUrl = value.trim().replace(/\s+/g, "");
    setConfig((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link) => (link.id === id ? { ...link, [field]: cleanUrl } : link)),
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Convert config to FooterConfigType format
      const footerData: FooterConfigType = {
        phones: config.phones,
        emails: config.emails,
        locationText: config.locationText,
        socialNetworks: config.socialNetworks,
        quickLinks: config.quickLinks,
      };

      // Call the server action
      const result = await updateBusinessFooter(footerData, businessId);

      if (result.status === "error") {
        setErrors(result.errors || {});
        toast.error("Please fix the errors below");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["business", codeId] });
      toast.success("Footer configuration saved successfully!");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get error for a specific field
  const getFieldError = (field: string, index?: number) => {
    if (index !== undefined) {
      return errors[`${field}.${index}`]?.[0] || errors[field]?.[0];
    }
    return errors[field]?.[0];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Footer Configuration</CardTitle>
          <CardDescription>Configure the footer content for your business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Phones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Phone Number(s) *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addPhone}>
                <Plus className="h-4 w-4 mr-1" />
                Add Phone
              </Button>
            </div>
            {config.phones.map((phone, index) => (
              <div key={phone.id} className="space-y-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="Phone number (e.g., +1234567890) *"
                    value={phone.number}
                    onChange={(e) => updatePhone(phone.id, e.target.value)}
                    required
                  />
                  {config.phones.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removePhone(phone.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {getFieldError("phones") && <p className="text-sm text-red-500">{getFieldError("phones")}</p>}
          </div>

          {/* Emails */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Email Address(es) *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addEmail}>
                <Plus className="h-4 w-4 mr-1" />
                Add Email
              </Button>
            </div>
            {config.emails.map((email, index) => (
              <div key={email.id} className="space-y-1">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Email address *"
                    value={email.address}
                    onChange={(e) => updateEmail(email.id, e.target.value)}
                    required
                  />
                  {config.emails.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeEmail(email.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {getFieldError("emails") && <p className="text-sm text-red-500">{getFieldError("emails")}</p>}
          </div>
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="locationText">Location Text *</Label>
            <Input
              id="locationText"
              placeholder="Enter your business location"
              value={config.locationText}
              required
              onChange={(e) => setConfig((prev) => ({ ...prev, locationText: e.target.value }))}
            />
            {getFieldError("locationText") && <p className="text-sm text-red-500">{getFieldError("locationText")}</p>}
          </div>

          {/* Social Networks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Social Network(s)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSocialNetwork}>
                <Plus className="h-4 w-4 mr-1" />
                Add Social
              </Button>
            </div>
            {config.socialNetworks.map((social, index) => (
              <div key={social.id} className="space-y-1">
                <div className="flex gap-2">
                  <Select value={social.type} onValueChange={(value) => updateSocialNetwork(social.id, "type", value)}>
                    <SelectTrigger className={`w-32 ${getFieldError("socialNetworks", index) ? "border-red-500" : ""}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {socialNetworkTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Social network URL"
                    value={social.url}
                    onChange={(e) => updateSocialNetwork(social.id, "url", e.target.value)}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeSocialNetwork(social.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {getFieldError("socialNetworks") && (
              <p className="text-sm text-red-500">{getFieldError("socialNetworks")}</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Quick Links</Label>
              <Button type="button" variant="outline" size="sm" onClick={addQuickLink}>
                <Plus className="h-4 w-4 mr-1" />
                Add Link
              </Button>
            </div>
            {config.quickLinks.map((link, index) => (
              <div key={link.id} className="space-y-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="Link name"
                    value={link.name}
                    onChange={(e) => updateQuickLink(link.id, "name", e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateQuickLink(link.id, "url", e.target.value)}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeQuickLink(link.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {getFieldError("quickLinks") && <p className="text-sm text-red-500">{getFieldError("quickLinks")}</p>}

          {/* Save Button */}
          <div className="pt-4">
            <Button onClick={handleSave} className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isLoading ? "Saving..." : "Save Footer Configuration"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterConfigForm;
