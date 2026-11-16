import {
  Activity,
  AreaChart,
  Boxes,
  Compass,
  Copy,
  Dices,
  LineChart,
  Sigma,
  TrendingUp,
  Waves,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Activity,
  AreaChart,
  Boxes,
  Compass,
  Copy,
  Dices,
  LineChart,
  Sigma,
  TrendingUp,
  Waves,
};

export function ChapterIcon({
  name,
  className = "h-5 w-5",
  strokeWidth = 2,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = icons[name] ?? Sigma;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
