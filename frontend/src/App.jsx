import { useState, useEffect } from 'react'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import { Persons } from './components/Persons'
import { Notification } from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons))
  }, [])

  const handleChangeName = (e) => {
    setNewName(e.target.value)
  }
  const handleChangeNumber = (e) => {
    setPhoneNumber(e.target.value)
  }
  const handleChangeFilter = (e) => {
    setFilter(e.target.value)
  }

  const addPerson = (e) => {
    e.preventDefault()

    if (newName.trim().length && phoneNumber.trim().length) {
      const findedPerson = persons.find((person) => person.name === newName)

      const newPerson = {
        name: newName,
        number: phoneNumber,
      }

      if (findedPerson) {
        updatePerson(findedPerson.id, newPerson)
        return
      }

      personService.create(newPerson).then((returnedPerson) => {
        setPersons([...persons, returnedPerson])
        setSuccessMessage(`Added ${newName}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        setNewName('')
        setPhoneNumber('')
      })
    }
  }

  const deletePerson = ({ id, name }) => {
    if (confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id))
        })
        .catch((e) => {
          console.error(e.message)
          setErrorMessage(
            `Information of ${name} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter((p) => p.id !== id))
        })
    }
  }

  const updatePerson = (id, newPerson) => {
    const isConfirm = confirm(
      `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
    )
    if (isConfirm) {
      personService
        .update(id, newPerson)
        .then((returnedPerson) => {
          setPersons(persons.map((p) => (p.id !== id ? p : returnedPerson)))
        })
        .catch((e) => {
          console.error(e.message)
          setErrorMessage(
            `Information of ${newPerson.name} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter((p) => p.id !== id))
        })
    }
  }

  const filteredPersons = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      {!!successMessage && <Notification message={successMessage} />}
      {!!errorMessage && <Notification message={errorMessage} status='error' />}

      <Filter filter={filter} handleChange={handleChangeFilter} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        changeName={handleChangeName}
        phoneNumber={phoneNumber}
        changeNumber={handleChangeNumber}
        handleSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App
