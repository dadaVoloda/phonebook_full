const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
app.use(express.static('dist'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/info', (req, res) => {
  const count = persons.length
  const date = new Date().toString()
  res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((pers) => pers.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

app.post('/api/persons', (req, res) => {
  const { body } = req

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }
  if (persons.map((p) => p.name).includes(body.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.random(),
  }

  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((pers) => pers.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
