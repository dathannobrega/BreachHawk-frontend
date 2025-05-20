import "../../styles/ui/status-badge.css"

const StatusBadge = ({ status, text }) => {
  const getStatusClass = () => {
    switch (status) {
      case "success":
        return "status-success"
      case "warning":
        return "status-warning"
      case "danger":
        return "status-danger"
      case "info":
        return "status-info"
      default:
        return ""
    }
  }

  return <span className={`status-badge ${getStatusClass()}`}>{text}</span>
}

export default StatusBadge
