import { Metadata } from "next";
import { getEventBySlug } from "@/queries/server/event/getEventBySlug";

interface EventLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;

  try {
    const eventResult = await getEventBySlug(slug);

    if (!eventResult || eventResult.status !== "success" || !eventResult.data?.event) {
      return {
        title: "Event Not Found",
        description: "The requested event could not be found.",
      };
    }

    const { event } = eventResult.data;

    // Find the text for the current locale, fallback to default locale, then first available
    const currentLocaleText =
      event.EventText.find((text) => text.Language.code === locale) ||
      event.EventText.find((text) => text.Language.code === event.defaultLocale) ||
      event.EventText[0];

    if (!currentLocaleText) {
      return {
        title: "Event Not Found",
        description: "The requested event could not be found.",
      };
    }

    // Get event type and subtype for additional context
    const eventTypeMap: Record<string, string> = {
      party: "Party",
      conference: "Conference",
      workshop: "Workshop",
      concert: "Concert",
      festival: "Festival",
      exhibition: "Exhibition",
      sports: "Sports",
      cultural: "Cultural",
      business: "Business",
      educational: "Educational",
    };

    const eventType = eventTypeMap[event.Type.name] || event.Type.name;

    const title = `${currentLocaleText.title}`;
    const description =
      currentLocaleText.description.length > 160
        ? `${currentLocaleText.description.substring(0, 157)}...`
        : currentLocaleText.description;

    // Get the first image for Open Graph
    const firstImage = event.EventImage?.[0]?.url;

    return {
      title,
      description,
      keywords: [
        eventType.toLowerCase(),
        ...(event.SubType.name ? [event.SubType.name.toLowerCase()] : []),
        ...(event.keywords || []),
        "event",
        "tickets",
        locale,
      ],
      authors: [{ name: "qvaevents" }],
      creator: "qvaevents",
      publisher: "qvaevents",

      // Open Graph metadata
      openGraph: {
        title,
        description,
        type: "website",
        locale: locale,
        siteName: "qvaevents",
        images: firstImage
          ? [
              {
                url: firstImage,
                width: 1200,
                height: 630,
                alt: currentLocaleText.title,
              },
            ]
          : [],
      },

      // Twitter Card metadata
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: firstImage ? [firstImage] : [],
      },

      // Additional metadata
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },

      // Event-specific metadata
      other: {
        "event:start_time": event.startDate,
        "event:end_time": event.endDate,
        "event:location": currentLocaleText.locationText || "",
        "event:category": eventType,
        "event:capacity": event.visitsLimit?.toString() || "",
        "event:age_restriction": event.isForMinors ? "all_ages" : "adults_only",
      },

      // Canonical URL
      alternates: {
        canonical: `/${locale}/event/${slug}`,
        languages: event.EventText.reduce((acc, text) => {
          acc[text.Language.code] = `/${text.Language.code}/event/${slug}`;
          return acc;
        }, {} as Record<string, string>),
      },
    };
  } catch (error) {
    console.error("Error generating metadata for event:", error);
    return {
      title: "Event | qvaevents",
      description: "Discover amazing events on qvaevents platform.",
    };
  }
}

export default function EventLayout({ children }: EventLayoutProps) {
  return children;
}
