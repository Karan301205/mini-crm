import FollowupStatusBadge from "./FollowupStatusBadge";

export default function FollowupCard({ followup }) {
  const counselorName = typeof followup.counselor === "object" 
    ? followup.counselor?.name 
    : followup.counselor;

  const displayDate = followup.date || (followup.scheduledAt 
    ? new Date(followup.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date(followup.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }));

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-lg font-bold text-gray-800">
            {followup.title}
          </h3>

          <p className="text-gray-500 mt-1">
            {displayDate}
          </p>

        </div>

        <FollowupStatusBadge status={followup.status} />

      </div>

      <p className="mt-4 text-gray-700 leading-relaxed">
        {followup.comment}
      </p>

      <div className="mt-5 pt-4 border-t flex items-center justify-between">

        <p className="text-sm text-gray-500">
          Counselor
        </p>

        <p className="font-semibold">
          {counselorName}
        </p>

      </div>

    </div>
  );
}