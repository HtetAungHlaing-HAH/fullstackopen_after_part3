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
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

//Delete resources
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

//to generate randome id
const randomId =(max) => {
  const id = Math.floor(Math.random() * max )
  return id
}

//Create new resource
app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name)
  {
    return response.status(400).json({
      error: "Name Missing"
    })
  }
  else if(!body.number)
  {
    return response.status(400).json({
      error: "Number Missing"
    })
  }
  else if(persons.find(person => person.name === body.name))
  {
    return response.status(400).json({
      error: "Name must be unique"
    })
  }
  const person = {
    id: randomId(10000),
    name: body.name,
    number: body.number
  }
  
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})