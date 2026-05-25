export default function KpiCard({
  title,
  value,
  icon,
  color
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">

      <div>
        <p className="text-gray-500 font-medium">
          {title}
        </p>

        <h2 className="text-4xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>

    </div>
  );
}