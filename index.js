const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('data', function (req, res) {
  if(req.method === "POST")
  {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//root of PERSONS REST API
app.get('/', (request, response) => {
    response.send('<h1>Hello, This is PERSONS REST API</h1>')
})

//persons resource
app.get('/api/persons', (request, response) => {
    response.send(persons)
})

//info of PERSONS REST API
app.get('/info', (request, response) => {
  const current_datetime = new Date()
  const persons_count = persons.length
  response.send(`
  <div>Phone book has info for ${persons_count} people</div>
  </br>
  <div>${current_datetime}</div>`)
})

//individual person resource
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if(person)
  {
    response.json(person)
  }
  else
  {
    response.status(404).end()
  }
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})