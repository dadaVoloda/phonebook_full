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
  const [notice, setNotice] = useState({ message: '', status: '' })

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

  const showNotification = (message, status = 'success') => {
    setNotice({ message, status })
    setTimeout(() => {
      setNotice({ message: '', status: '' })
    }, 5000)
  }

  const cleanForm = () => {
    setNewName('')
    setPhoneNumber('')
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

      personService
        .create(newPerson)
        .then((createdPerson) => {
          setPersons([...persons, createdPerson])
          showNotification(`Added ${newName}`)
          cleanForm()
        })
        .catch((error) => {
          console.log(error.response.data.error)
          showNotification(error.response.data.error, 'error')
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
          showNotification(
            `Information of ${name} has already been removed from server`,
            'error'
          )
          setPersons(persons.filter((p) => p.id !== id))
        })
    }
  }

  const updatePerson = (id, newPerson) => {
    const isConfirm = confirm(
      `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
    )
    if (isConfirm) {
      // personService
      //   .update(id, newPerson)
      //   .then((updatedPerson) => {
      //     setPersons(persons.map((p) => (p.id !== id ? p : updatedPerson)))
      //   })
      //   .catch((e) => {
      //     console.error(e.message)
      //     showNotification(
      //       `Information of ${newPerson.name} has already been removed from server`,
      //       'error'
      //     )
      //     setPersons(persons.filter((p) => p.id !== id))
      //   })
      personService
        .update(newPerson)
        .then((updatedPerson) => {
          setPersons(persons.map((p) => (p.id !== id ? p : updatedPerson)))
          showNotification(`Updated ${updatedPerson.name}`)
          cleanForm()
        })
        .catch((e) => {
          console.error(e.message)
          showNotification(
            `Information of ${newPerson.name} has already been removed from server`,
            'error'
          )
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
      {!!notice.message && <Notification notice={notice} />}

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
