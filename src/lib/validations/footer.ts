import { z } from "zod";

// Phone validation schema
const phoneSchema = z.object({
  id: z.string(),
  number: z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => val.trim().replace(/\s+/g, "")) // Clean the phone number
    .refine(
      (val) => /^[\+]?[1-9][\d]{7,15}$/.test(val), // More flexible regex: 8-16 digits
      "Please enter a valid phone number (8-16 digits, optionally starting with +)"
    ),
});

// Email validation schema
const emailSchema = z.object({
  id: z.string(),
  address: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
});

// Social network validation schema
const socialNetworkSchema = z.object({
  id: z.string(),
  type: z.enum(["instagram", "facebook", "twitter", "linkedin", "youtube", "tiktok", "whatsapp", "telegram"]),
  url: z.string().min(1, "Social network URL is required").url("Please enter a valid URL"),
});

// Quick link validation schema
const quickLinkSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Link name is required").max(50, "Link name must be less than 50 characters"),
  url: z.string().min(1, "Link URL is required").url("Please enter a valid URL"),
});

// Main footer configuration validation schema
export const footerConfigSchema = z.object({
  phones: z
    .array(phoneSchema)
    .min(1, "At least one phone number is required")
    .max(5, "Maximum 5 phone numbers allowed"),
  emails: z
    .array(emailSchema)
    .min(1, "At least one email address is required")
    .max(5, "Maximum 5 email addresses allowed"),
  locationText: z
    .string()
    .min(1, "Location text is required")
    .max(200, "Location text must be less than 200 characters"),
  socialNetworks: z
    .array(socialNetworkSchema)
    .max(8, "Maximum 8 social networks allowed")
    .refine(
      (socials) => {
        // If any social network is provided, both type and url must be present
        return socials.every((social) => social.type && social.url);
      },
      {
        message: "Both type and URL are required for social networks",
      }
    ),
  quickLinks: z
    .array(quickLinkSchema)
    .max(10, "Maximum 10 quick links allowed")
    .refine(
      (links) => {
        // If any quick link is provided, both name and url must be present
        return links.every((link) => link.name && link.url);
      },
      {
        message: "Both name and URL are required for quick links",
      }
    ),
});

export type FooterConfigType = z.infer<typeof footerConfigSchema>;
