import "../../styles/ui/stat-card.css"

const StatCard = ({ icon, title, value, status = "default" }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${status}`}>{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  )
}

export default StatCard
