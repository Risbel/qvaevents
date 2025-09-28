"use client";

import dynamic from "next/dynamic";

// Dynamically import Leaflet components with SSR disabled
const LeafletMapPreviewForEvents = dynamic(() => import("@/app/components/LeafletMapPreviewForEvents"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-muted rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

interface EventMapProps {
  lat: number;
  lng: number;
}

export default function EventMap({ lat, lng }: EventMapProps) {
  return <LeafletMapPreviewForEvents lat={lat} lng={lng} />;
}
