export default function FollowupStatusBadge({ status }) {

  const styles = {
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Upcoming: "bg-blue-100 text-blue-700"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}