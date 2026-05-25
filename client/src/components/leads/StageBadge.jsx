export default function StageBadge({ stage }) {

  const colors = {
    "New Lead": "bg-blue-100 text-blue-700",
    Interested: "bg-purple-100 text-purple-700",
    "Follow-Up": "bg-orange-100 text-orange-700",
    Visited: "bg-green-100 text-green-700"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[stage]}`}>
      {stage}
    </span>
  );
}