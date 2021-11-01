const express = require('express')
const app = express()

app.use(express.json())

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})