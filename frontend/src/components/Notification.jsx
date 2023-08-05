export const Notification = ({ notice }) => {
  const { message, status } = notice

  return <div className={`notice ${status}`}>{message}</div>
}
