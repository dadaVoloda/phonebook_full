export const PersonForm = ({
  handleSubmit,
  changeName,
  newName,
  changeNumber,
  phoneNumber,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input type='text' value={newName} onChange={changeName} />
      </div>
      <div>
        number: <input type='tel' value={phoneNumber} onChange={changeNumber} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}
