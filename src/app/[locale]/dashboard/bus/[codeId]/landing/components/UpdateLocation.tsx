import { useState, useTransition, useOptimistic } from "react";
import InteractiveMap from "../../new/[step]/components/basic-info/InteractiveMap";
import { Business } from "@/queries/client/business/getBusinessByCodeId";
import { updateBusinessLocation } from "@/actions/business/updateBusinessLocation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const DEFAULT_COORDINATES = { lat: 22.144916, lng: -80.448374 } as const;

const UpdateLocation = ({ business }: { business: Business }) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const initialCoordinates = {
    lat: business.lat ?? DEFAULT_COORDINATES.lat,
    lng: business.lng ?? DEFAULT_COORDINATES.lng,
  };

  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>(initialCoordinates);

  const [optimisticCoordinates, addOptimisticCoordinates] = useOptimistic(
    coordinates,
    (_, newCoordinates: { lat: number | null; lng: number | null }) => newCoordinates
  );

  const handleMapLocationSelect = (lat: number, lng: number) => {
    const nextCoordinates = { lat, lng };
    const previousCoordinates = coordinates;

    startTransition(() => {
      addOptimisticCoordinates(nextCoordinates);

      updateBusinessLocation(business.id, lat, lng)
        .then((result) => {
          if (result.status === "error") {
            throw new Error(result.error);
          }

          setCoordinates(nextCoordinates);

          return queryClient.invalidateQueries({ queryKey: ["business", business.codeId ?? ""] });
        })
        .then(() => {
          toast.success("Location updated successfully.");
        })
        .catch((error) => {
          console.error(error);
          startTransition(() => {
            addOptimisticCoordinates(previousCoordinates);
          });
          toast.error("Failed to update location. Please try again.");
        });
    });
  };

  return (
    <form>
      {/* Hidden inputs for coordinates */}
      <input type="hidden" name="businessId" value={business.id} id="businessId" />
      <input
        type="hidden"
        name="lat"
        value={(optimisticCoordinates.lat ?? DEFAULT_COORDINATES.lat).toString()}
        id="lat"
      />
      <input
        type="hidden"
        name="lng"
        value={(optimisticCoordinates.lng ?? DEFAULT_COORDINATES.lng).toString()}
        id="lng"
      />
      {/* Interactive Map */}
      <div className="mt-4">
        <InteractiveMap
          lat={optimisticCoordinates.lat ?? DEFAULT_COORDINATES.lat}
          lng={optimisticCoordinates.lng ?? DEFAULT_COORDINATES.lng}
          zoom={optimisticCoordinates.lat && optimisticCoordinates.lng ? 15 : 14}
          isInteractive={!isPending}
          onLocationSelect={handleMapLocationSelect}
        />
      </div>
    </form>
  );
};
export default UpdateLocation;
