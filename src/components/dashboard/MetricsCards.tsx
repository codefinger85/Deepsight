"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Activity, Target } from "lucide-react";

const metrics = [
  {
    title: "Revenue",
    value: "$1,250.00",
    change: "+25.6%",
    description: "Trending up this month",
    icon: TrendingUp,
    trend: "up" as const
  },
  {
    title: "Sessions",
    value: "1,234",
    change: "-20%",
    description: "Down 20% this period",
    icon: Users,
    trend: "down" as const
  },
  {
    title: "Trades",
    value: "45,678",
    change: "+15.3%",
    description: "Strong user retention",
    icon: Activity,
    trend: "up" as const
  },
  {
    title: "Winrate",
    value: "4.5%",
    change: "+4.3%",
    description: "Steady performance increase",
    icon: Target,
    trend: "up" as const
  }
];

export default function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-slate-600" />
              </div>
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {metric.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">{metric.title}</p>
              <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
              <p className="text-xs text-slate-500">{metric.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}