"use client";

import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
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

const selectedIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C10.48 2 6 6.48 6 12c0 7 10 18 10 18s10-11 10-18c0-5.52-4.48-10-10-10zm0 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#ef4444"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

L.Marker.prototype.options.icon = defaultIcon;

type LeafletMapPreviewFormProps = {
  lat: number;
  lng: number;
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  isInteractive?: boolean;
};

function MapClickHandler({
  onLocationSelect,
  isInteractive,
}: {
  onLocationSelect?: (lat: number, lng: number) => void;
  isInteractive?: boolean;
}) {
  useMapEvents({
    click: (e) => {
      if (isInteractive && onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function LeafletMapPreviewForm({
  lat,
  lng,
  zoom = 15,
  onLocationSelect,
  isInteractive = false,
}: LeafletMapPreviewFormProps) {
  const t = useTranslations("maps.previewForm");
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat, lng });
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [inputLat, setInputLat] = useState(lat.toString());
  const [inputLng, setInputLng] = useState(lng.toString());

  const handleLocationSelect = (selectedLat: number, selectedLng: number) => {
    if (isInteractive) {
      setSelectedPosition({ lat: selectedLat, lng: selectedLng });
    }
  };

  const handleUseLocation = () => {
    if (selectedPosition && onLocationSelect) {
      onLocationSelect(selectedPosition.lat, selectedPosition.lng);
      // Update the map center to the selected position
      setMapCenter(selectedPosition);
      setSelectedPosition(null);
    }
  };

  const handleCancelSelection = () => {
    setSelectedPosition(null);
  };

  const handleViewInGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}`;
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  // Update center and zoom when props change (but not from user interactions)
  useEffect(() => {
    // Only update if the coordinates are different from current center
    if (lat !== mapCenter.lat || lng !== mapCenter.lng) {
      setMapCenter({ lat, lng });
      setCurrentZoom(zoom);
      setInputLat(lat.toString());
      setInputLng(lng.toString());
    }
  }, [lat, lng, zoom, mapCenter.lat, mapCenter.lng]);

  // Keep input fields in sync with map center
  useEffect(() => {
    setInputLat(mapCenter.lat.toString());
    setInputLng(mapCenter.lng.toString());
  }, [mapCenter.lat, mapCenter.lng]);

  return (
    <div className="space-y-3">
      {isInteractive && !selectedPosition && <label className="text-sm">{t("clickToSelect")}</label>}
      <div style={{ width: "100%", height: "300px" }}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={currentZoom}
          maxZoom={18}
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          dragging={true}
          touchZoom={true}
          className="z-30"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[mapCenter.lat, mapCenter.lng]} icon={defaultIcon} />

          {isInteractive && selectedPosition && (
            <Marker position={[selectedPosition.lat, selectedPosition.lng]} icon={selectedIcon} />
          )}

          <MapClickHandler onLocationSelect={handleLocationSelect} isInteractive={isInteractive} />
        </MapContainer>
      </div>

      {isInteractive && selectedPosition && (
        <div className="flex gap-4 flex-col md:flex-row justify-between items-center p-3 bg-muted rounded-lg">
          <div className="text-sm">
            <div className="font-medium">{t("selectedLocation")}</div>
            <div className="text-muted-foreground">
              {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={handleUseLocation} className="cursor-pointer">
              {t("useThisLocation")}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancelSelection} className="cursor-pointer">
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewInGoogleMaps}
          className="flex items-center gap-2 cursor-pointer"
        >
          <MapPin className="h-4 w-4" />
          {t("seeInGoogleMaps")}
        </Button>
      </div>
    </div>
  );
}
