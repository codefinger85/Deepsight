import { Card } from "@/components/ui/card";
import WinrateChart from "./WinrateChart";

export default function Analyze() {
  return (
    <div className="container mx-auto pb-8 max-w-[270px]">
      <Card className="card-container">
        <div className="pt-3">
          <WinrateChart />
        </div>
      </Card>
    </div>
  );
} 