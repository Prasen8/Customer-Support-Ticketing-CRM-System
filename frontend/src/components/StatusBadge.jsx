/**
 * Returns the appropriate CSS class for a status badge.
 */
export function getStatusClass(status) {
  switch (status) {
    case "Open":        return "badge badge-open";
    case "In Progress": return "badge badge-progress";
    case "Closed":      return "badge badge-closed";
    default:            return "badge";
  }
}

/**
 * Renders a colored status badge with an animated dot.
 */
export default function StatusBadge({ status }) {
  return (
    <span className={getStatusClass(status)}>
      <span className="badge-dot" />
      {status}
    </span>
  );
}
