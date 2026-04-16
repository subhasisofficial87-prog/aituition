interface TodaysLessonProps {
  planId: number | null;
  todayEntry: any;
  completedDays: number;
}

export default function TodaysLesson({ planId, todayEntry, completedDays }: TodaysLessonProps) {
  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <p className="text-sm text-gray-600">Today's Lesson (Coming soon)</p>
    </div>
  );
}
