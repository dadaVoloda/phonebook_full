const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

personsRouter.get('/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

personsRouter.post('/', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  Person.find({}).then((persons) => {
    const updatedPerson = persons.find((p) => p.name === name)
    if (updatedPerson) {
      Person.findByIdAndUpdate(
        updatedPerson.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
      )
        .then((updatedPerson) => {
          res.json(updatedPerson)
        })
        .catch((error) => next(error))
    } else {
      const person = new Person({
        name,
        number,
      })

      person
        .save()
        .then((savedPerson) => {
          res.json(savedPerson)
        })
        .catch((error) => next(error))
    }
  })
})

personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = personsRouter
