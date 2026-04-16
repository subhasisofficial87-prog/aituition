interface StudyCalendarProps {
  planData: any[];
  completedDays: number;
  planId: number;
}

export default function StudyCalendar({ planData, completedDays, planId }: StudyCalendarProps) {
  return (
    <div className="p-4 bg-purple-50 rounded-lg">
      <p className="text-sm text-gray-600">Study Calendar (Coming soon)</p>
    </div>
  );
}
