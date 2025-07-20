import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface LossReasonIconProps {
  tradeId: number;
  initialLossReasons: string[] | null; // Expect string[] or null
}

const ALL_REASONS = [
  "Bad luck. Trade was solid.",
  "Going against the trend.",
  "Going against momentum.",
  "Bad entry.",
  "Candle timing expiry.",
  "Random trade.",
];

export default function LossReasonIcon({ tradeId, initialLossReasons }: LossReasonIconProps) {
  // Initialize state correctly, handling null or empty string from backend

  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Initialize state when component mounts or initial reasons change
   useEffect(() => {
    try {
      // Assuming initialLossReasons from DB is JSON string or null
      const parsed = initialLossReasons ? JSON.parse(initialLossReasons as unknown as string) : [];
      setSelectedReasons(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("Failed to parse initial loss reasons:", initialLossReasons, e);
      setSelectedReasons([]); // Fallback to empty array on error
    }
  }, [initialLossReasons]);


  const handleReasonChange = async (reason: string, checked: boolean | string) => {
    let updatedReasons: string[];
    if (checked) {
      updatedReasons = [...selectedReasons, reason];
    } else {
      updatedReasons = selectedReasons.filter((r) => r !== reason);
    }
    
    setSelectedReasons(updatedReasons);

    try {
      const response = await fetch(`/api/trades/${tradeId}/loss-reasons`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lossReasons: JSON.stringify(updatedReasons) }),
      });
      
      if (!response.ok) {
        return;
      }
      
      console.log(`Updated loss reasons for trade ${tradeId}:`, updatedReasons);
    } catch (error) {
      console.error("Failed to update loss reasons:", error);
    }
  };

  const hasSelectedReasons = selectedReasons.length > 0;

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <button className="focus:outline-none">
          <Info 
            className={`w-4 h-4 cursor-pointer transition-colors duration-200 ${
              // Invert the color logic
              hasSelectedReasons ? "text-slate-400 hover:text-slate-500" : "text-red-400 hover:text-red-500"
            }`} 
          />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto px-4 pt-4 pb-5 space-y-3 rounded-md shadow-lg border border-slate-200"
        align="center"
        sideOffset={5}
      >
        <p className="text-sm font-medium text-slate-700 mb-4 pb-3 border-b border-slate-200">Loss Reasons</p>
        {ALL_REASONS.map((reason) => (
          <div key={reason} className="flex items-center space-x-2">
            <Checkbox
              id={`${tradeId}-${reason.replace(/\s+/g, '-')}`} // Unique ID for checkbox
              checked={selectedReasons.includes(reason)}
              onCheckedChange={(checked) => handleReasonChange(reason, checked)}
              className="data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700 border-slate-300 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Label 
              htmlFor={`${tradeId}-${reason.replace(/\s+/g, '-')}`}
              className={`text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer transition-colors duration-150 ${ // Base classes
                selectedReasons.includes(reason) 
                  ? 'text-slate-700' // Color when selected
                  : 'text-slate-400 hover:text-slate-700' // Default and hover color
              }`}
            >
              {reason}
            </Label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}