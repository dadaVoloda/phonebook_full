const infoRouter = require('express').Router()
const Person = require('../models/person')

infoRouter.get('/', (req, res) => {
  Person.find({}).then((persons) => {
    const count = persons.length
    const date = new Date().toString()
    res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
  })
})

module.exports = infoRouter
