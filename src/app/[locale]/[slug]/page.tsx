import { notFound } from "next/navigation";
import { BusinessWithOrganizer, getBusinessBySlug } from "@/queries/server/business/getBusinessBySlug";
import { ImageCarousel } from "@/app/components/ImageCarousel";
import Navbar from "./components/Navbar";
import EventList from "./components/events/EventList";
import ButtonsHero from "./components/events/ButtonsHero";
import DynamicFooter from "./components/DynamicFooter";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

const BusinessPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  const businessResult = await getBusinessBySlug(slug);

  if (businessResult.status === "error") {
    notFound();
  }

  const business = businessResult.data?.business as BusinessWithOrganizer;
  const organizer = business?.OrganizerProfile;

  if (!business || !organizer) {
    notFound();
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Navbar
        businessLogo={business.logo as string}
        initials={getInitials(business.name as string)}
        businessName={business.name as string}
      />

      {/* Banner/Slider Section with Overlapping Logo */}
      <section className="w-full relative" id="hero">
        <ImageCarousel
          images={business.BusinessImage.map((image) => ({ id: image.id, url: image.url }))}
          alt="Banner"
          className="h-[90vh] md:h-[90vh] lg:h-[90vh]"
          rounded="rounded-none"
          showControls={false}
          showIndicators={true}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <div className="max-w-7xl mx-auto px-4 md:px-8 absolute bottom-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{business.name}</h1>
            {business.description && (
              <p className="text-lg md:text-xl lg:text-2xl max-w-3xl opacity-90 leading-tight line-clamp-2 text-white/90">
                {business.description}
              </p>
            )}
            <ButtonsHero />
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="upcoming-events" className="py-24 px-4 bg-background snap-start">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
          <EventList />
        </div>
      </section>

      {/* Dynamic Footer */}
      <DynamicFooter business={business as BusinessWithOrganizer} />
    </>
  );
};

export default BusinessPage;
