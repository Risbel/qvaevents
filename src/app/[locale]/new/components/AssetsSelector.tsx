import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tables } from "@/types/supabase";

type Asset = Tables<"Asset">;

interface AssetsSelectorProps {
  assets: Asset[];
  selectedAsset?: string;
  onAssetChange?: (value: string) => void;
  showLabel?: boolean;
  labelText?: string;
}

const AssetsSelector = ({
  assets,
  selectedAsset = "",
  onAssetChange,
  showLabel = true,
  labelText = "Currency",
}: AssetsSelectorProps) => {
  if (!assets || assets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {showLabel && <Label>{labelText}</Label>}
      <RadioGroup value={selectedAsset} onValueChange={onAssetChange} className="flex flex-row gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className="flex items-center space-x-2">
            <RadioGroupItem value={asset.id.toString()} id={`asset-${asset.id}`} className="cursor-pointer" />
            <Label htmlFor={`asset-${asset.id}`} className="cursor-pointer">
              {asset.code}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default AssetsSelector;
