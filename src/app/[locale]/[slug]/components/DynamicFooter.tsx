import { Phone, Mail, MapPin } from "lucide-react";
import { FooterConfigType } from "@/lib/validations/footer";
import { BusinessWithOrganizer } from "@/queries/server/business/getBusinessBySlug";
import Image from "next/image";
import {
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  YoutubeIcon,
  TiktokIcon,
  WhatsappIcon,
  TelegramIcon,
} from "@/components/icons";

interface DynamicFooterProps {
  business: BusinessWithOrganizer;
}

const DynamicFooter = ({ business }: DynamicFooterProps) => {
  const footerConfig = business.footerConfig as FooterConfigType;

  if (!footerConfig) {
    return null;
  }

  const getSocialIcon = (type: string) => {
    switch (type) {
      case "instagram":
        return InstagramIcon;
      case "facebook":
        return FacebookIcon;
      case "twitter":
        return TwitterIcon;
      case "linkedin":
        return LinkedinIcon;
      case "youtube":
        return YoutubeIcon;
      case "tiktok":
        return TiktokIcon;
      case "whatsapp":
        return WhatsappIcon;
      case "telegram":
        return TelegramIcon;
      default:
        return InstagramIcon; // Default fallback
    }
  };

  return (
    <footer id="contact" className="bg-black text-white py-12 px-4 mt-auto snap-start border-t">
      <div className="flex mb-4 justify-center md:justify-start">
        <Image
          src={business.OrganizerProfile.logo as string}
          alt={business.name as string}
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <div className="space-y-2 text-sm">
            {footerConfig.phones.map((phone) => (
              <p key={phone.id} className="flex items-center gap-2">
                <Phone size={20} />
                <span>{phone.number}</span>
              </p>
            ))}
            {footerConfig.emails.map((email) => (
              <p key={email.id} className="flex items-center gap-2">
                <Mail size={20} />
                <span>{email.address}</span>
              </p>
            ))}
            {footerConfig.locationText && (
              <p className="flex items-center gap-2">
                <MapPin size={20} />
                <span>{footerConfig.locationText}</span>
              </p>
            )}
          </div>
        </div>

        {/* Social Links */}
        {footerConfig.socialNetworks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {footerConfig.socialNetworks.map((social) => {
                const IconComponent = getSocialIcon(social.type);
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    title={social.type.charAt(0).toUpperCase() + social.type.slice(1)}
                  >
                    <IconComponent
                      size={24}
                      fill="currentColor"
                      className="text-white hover:text-gray-300 transition-colors"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Links */}
        {footerConfig.quickLinks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerConfig.quickLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-primary text-center text-sm font-extralight">
        <p>
          &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default DynamicFooter;
