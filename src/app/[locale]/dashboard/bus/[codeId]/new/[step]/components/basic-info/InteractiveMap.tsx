"use client";

import dynamic from "next/dynamic";

// Dynamically import Leaflet components with SSR disabled
const LeafletMapPreviewForm = dynamic(() => import("@/app/components/LeafletMapPreviewForm"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-muted rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

interface InteractiveMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  isInteractive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export default function InteractiveMap({ lat, lng, zoom, isInteractive, onLocationSelect }: InteractiveMapProps) {
  return (
    <LeafletMapPreviewForm
      lat={lat}
      lng={lng}
      zoom={zoom}
      isInteractive={isInteractive}
      onLocationSelect={onLocationSelect}
    />
  );
}
