const mongoose = require('mongoose')

//command line validation < 3
// eslint-disable-next-line no-undef
if(process.argv.length < 3)
{
  console.log('Please provide the password as an argument: node mongo.js <password>')
  // eslint-disable-next-line no-undef
  process.exit()
}

//connection started
// eslint-disable-next-line no-undef
const password = process.argv[2]
const url = `mongodb+srv://my_fullstack:${password}@cluster0.imzpt.mongodb.net/phonebook_app?retryWrites=true&w=majority`
mongoose.connect(url)

//schema creation
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

//model creation based on schema
const Person = mongoose.model('Person', personSchema)

// eslint-disable-next-line no-undef
if(process.argv.length === 3)
{
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name,' ',person.number)
    })
    mongoose.connection.close()
  })
}
// eslint-disable-next-line no-undef
else if(process.argv.length === 5)
{
  // eslint-disable-next-line no-undef
  const input_name = process.argv[3]
  // eslint-disable-next-line no-undef
  const input_number = process.argv[4]

  const person = new Person({
    name: input_name,
    number: input_number,
  })

  // eslint-disable-next-line no-unused-vars
  person.save().then(result => {
    console.log(`added  ${input_name} number ${input_number} to phonebook`)
    mongoose.connection.close()
  })
}

