export default function StatCard({ label, value }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card__label">{label}</div>
      <div className="admin-stat-card__value">{value}</div>
    </div>
  );
}
