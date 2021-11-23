const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

//morgan create new token
morgan.token('data', function (req, res) {
  if(req.method === "POST")
  {
    return JSON.stringify(req.body)
  }
})

//use morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


//root of PERSONS REST API
app.get('/', (request, response) => {
    response.send('<h1>Hello, This is PERSONS REST API</h1>')
})

//persons resource
app.get('/api/persons', (request, response) => {
    Person.find().then(persons => {
      response.json(persons)
    })
})

//info of PERSONS REST API
app.get('/info', (request, response) => {
  const current_datetime = new Date()
  Person.find().then(persons => {
    response.send(`
    <div>Phone book has info for ${persons.length} people</div>
    </br>
    <div>${current_datetime}</div>`)
  })
  
})

//individual person resource
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    response.json(person)
  })
  .catch(error => next(error))
})

//Delete resources
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//to generate randome id
const randomId =(max) => {
  const id = Math.floor(Math.random() * max )
  return id
}

//Create new resource
app.post('/api/persons', (request, response) => {
  const body = request.body

  if(body.name === undefined)
  {
    return response.status(400).json({error: 'name missing'})
  }
  else if(body.number === undefined)
  {
    return response.status(400).json({error: 'number missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

//unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

//error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError')
  {
    response.status(400).send({ error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})