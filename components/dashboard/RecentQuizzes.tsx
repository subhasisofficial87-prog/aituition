interface RecentQuizzesProps {
  quizzes?: any[];
}

export default function RecentQuizzes({ quizzes = [] }: RecentQuizzesProps) {
  return (
    <div className="p-4 bg-yellow-50 rounded-lg">
      <p className="text-sm text-gray-600">Recent Quizzes (Coming soon)</p>
    </div>
  );
}
