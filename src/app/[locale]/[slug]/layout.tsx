import { Metadata } from "next";
import { getBusinessBySlug, BusinessWithOrganizer } from "@/queries/business/getBusinessBySlug";

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
      };
    }

    const business = businessResult.data.business as BusinessWithOrganizer;
    const organizer = business.OrganizerProfile;

    const businessName = business.name || organizer.companyName || "Business";
    const businessDescription =
      business.description || `${businessName} is a business managed by ${organizer.companyName}.`;

    return {
      title: `${businessName} - QvaEvents`,
      description: businessDescription,
      openGraph: {
        title: businessName,
        description: businessDescription,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: businessName,
        description: businessDescription,
      },
    };
  } catch (error) {
    return {
      title: "Business Profile - QvaEvents",
      description: "View business information and upcoming events on QvaEvents.",
    };
  }
}

export default function BusinessLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="relative">{children}</main>

      {/* Simple Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6">
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
