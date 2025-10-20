import { Metadata } from "next";
import { getBusinessBySlug, BusinessWithOrganizer } from "@/queries/server/business/getBusinessBySlug";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug, locale } = await params;

  try {
    const businessResult = await getBusinessBySlug(slug);

    if (businessResult.status === "error" || !businessResult.data?.business) {
      return {
        title: "Business Not Found - QvaEvents",
        description: "The requested business could not be found.",
        robots: "noindex, nofollow",
      };
    }

    const business = businessResult.data.business as BusinessWithOrganizer;
    const organizer = business.OrganizerProfile;

    const businessName = business.name || organizer.companyName || "Business";
    const businessDescription =
      business.description || `${businessName} is a business managed by ${organizer.companyName}.`;

    // Get the logo URL - prefer business logo over organizer logo
    const logoUrl = business.logo || null;
    const images = business.BusinessImage?.map((img) => img.url) || [];

    // Base metadata
    const metadata: Metadata = {
      title: `${businessName}`,
      description: businessDescription,
      robots: "index, follow",
      alternates: {
        canonical: `https://qvaevents.vercel.app/${locale}/${slug}`,
      },
      openGraph: {
        title: businessName,
        description: businessDescription,
        type: "website",
        url: `https://qvaevents.vercel.app/${locale}/${slug}`,
        siteName: "QvaEvents",
        locale: locale,
        images: logoUrl
          ? [
              {
                url: logoUrl,
                width: 1200,
                height: 630,
                alt: `${businessName} logo`,
              },
            ]
          : images.map((img) => ({
              url: img,
              width: 1200,
              height: 630,
              alt: `${businessName} image`,
            })),
      },
      twitter: {
        card: logoUrl ? "summary" : "summary_large_image",
        title: businessName,
        description: businessDescription,
        images: logoUrl ? [logoUrl] : images,
        creator: "@qvaevents",
        site: "@qvaevents",
      },
      icons: logoUrl
        ? {
            icon: logoUrl,
            apple: logoUrl,
          }
        : undefined,
    };

    return metadata;
  } catch (error) {
    return {
      title: "Business Profile - QvaEvents",
      description: "View business information and upcoming events on QvaEvents.",
      robots: "noindex, nofollow",
    };
  }
}

export default function BusinessLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="relative max-w-4xl mx-auto">{children}</main>

      {/* Simple Footer */}
      <footer className="border-t bg-primary/10" id="contact">
        <div className="container mx-auto px-4 py-2">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} QvaEvents. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
