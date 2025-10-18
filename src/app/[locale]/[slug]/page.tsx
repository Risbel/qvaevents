import { notFound } from "next/navigation";
import { getBusinessBySlug, BusinessWithOrganizer } from "@/queries/server/business/getBusinessBySlug";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { ImageCarousel } from "@/app/components/ImageCarousel";
import Navbar from "./components/Navbar";
import { Button } from "@/components/ui/button";

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

  const getBusinessName = () => {
    return business.name || "Business";
  };
  const mockUpcomingEvents = [
    {
      id: 1,
      title: "Summer Festival 2024",
      date: "July 15, 2024",
      image: "/event1.jpg",
      description: "Join us for an amazing summer celebration!",
    },
    {
      id: 2,
      title: "Winter Festival 2024",
      date: "December 15, 2024",
      image: "/event2.jpg",
      description: "Join us for an amazing winter celebration!",
    },
    {
      id: 3,
      title: "Spring Festival 2024",
      date: "March 15, 2024",
      image: "/event3.jpg",
      description: "Join us for an amazing spring celebration!",
    },
    {
      id: 4,
      title: "Fall Festival 2024",
      date: "October 15, 2024",
      image: "/event4.jpg",
      description: "Join us for an amazing fall celebration!",
    },
    // Add more mock events as needed
  ];

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
          className="h-screen md:h-screen lg:h-screen"
          rounded="rounded-none"
          showControls={false}
          showIndicators={true}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <div className="max-w-7xl mx-auto px-4 md:px-8 absolute bottom-16 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{business.name}</h1>
            {business.description && (
              <p className="text-lg md:text-xl lg:text-2xl max-w-3xl opacity-90 leading-tight">
                {business.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="upcoming-events" className="py-16 px-4 bg-background snap-start">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockUpcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden py-0">
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-gray-600">{event.date}</p>
                  <p className="mt-2">{event.description}</p>
                  <Button className="mt-4 w-full">Learn More</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-background py-12 px-4 mt-auto snap-start">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Phone size={20} />
                <span>+1 (555) 123-4567</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={20} />
                <span>contact@business.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={20} />
                <span>123 Event Street, City, Country</span>
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-70">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:opacity-70">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:opacity-70">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:opacity-70">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-70">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-70">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-70">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>
            &copy; {new Date().getFullYear()} {getBusinessName() as string}. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default BusinessPage;
