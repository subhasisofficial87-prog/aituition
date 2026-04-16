interface MotivationalBannerProps {
  streak: number;
  progress: number;
  childName?: string;
}

export default function MotivationalBanner({ streak, progress, childName }: MotivationalBannerProps) {
  return (
    <div className="p-4 bg-indigo-50 rounded-lg">
      <p className="text-sm text-gray-600">Motivational Message (Coming soon)</p>
    </div>
  );
}
