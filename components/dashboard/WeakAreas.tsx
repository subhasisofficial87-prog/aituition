interface WeakAreasProps {
  areas: any[];
}

export default function WeakAreas({ areas }: WeakAreasProps) {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <p className="text-sm text-gray-600">Weak Areas (Coming soon)</p>
    </div>
  );
}
