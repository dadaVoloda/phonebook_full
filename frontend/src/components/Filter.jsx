export const Filter = ({ filter, handleChange }) => {
  return (
    <div>
      filter shown with{' '}
      <input type='text' value={filter} onChange={handleChange} />
    </div>
  )
}
