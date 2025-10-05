"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { LucideRoute, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

type LeafletMapPreviewForEventsProps = {
  lat: number;
  lng: number;
  zoom?: number;
  title?: string;
  showCard?: boolean;
  showDirectionsButton?: boolean;
};

export default function LeafletMapPreviewForEvents({
  lat,
  lng,
  zoom = 14,
  title = "Location",
  showCard = true,
  showDirectionsButton = true,
}: LeafletMapPreviewForEventsProps) {
  const t = useTranslations("maps.previewForEvents");
  const center = [lat, lng] as [number, number];

  const handleDirectionsClick = () => {
    // Open Google Maps with directions to this location
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareLocation = async () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    const shareText = `📍 ${title}\n${googleMapsUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t("shareLocationTitle"),
          text: t("shareLocationText", { title }),
          url: googleMapsUrl,
        });
      } catch (err) {
        return;
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success(t("shareLocationCopied"));
    }
  };

  const mapComponent = (
    <div style={{ width: "100%", height: "300px" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        maxZoom={18}
        className="z-30"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={defaultIcon} />
      </MapContainer>
    </div>
  );

  if (!showCard) {
    return mapComponent;
  }

  return (
    <div>
      {mapComponent}
      {showDirectionsButton && (
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleShareLocation}>
            {t("shareLocation")}
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleDirectionsClick}>
            {t("howToGetThere")}
            <LucideRoute className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
