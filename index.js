require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
app.use(express.static('dist'))

app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    const count = persons.length
    const date = new Date().toString()
    res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
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

app.post('/api/persons', (req, res, next) => {
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

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
