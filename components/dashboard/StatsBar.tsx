interface StatsBarProps {
  streak: number;
  progress: number;
  weeklyMins: number;
  avgScore: number;
}

export default function StatsBar({ streak, progress, weeklyMins, avgScore }: StatsBarProps) {
  return (
    <div className="p-4 bg-green-50 rounded-lg">
      <p className="text-sm text-gray-600">Dashboard Stats (Coming soon)</p>
    </div>
  );
}
