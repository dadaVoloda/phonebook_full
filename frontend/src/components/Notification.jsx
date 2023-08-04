export const Notification = ({ message, status = 'success' }) => {
  if (message === null) {
    return null
  }

  return <div className={`notice ${status}`}>{message}</div>
}
