const mongoose = require('mongoose')

//command line validation < 3
if(process.argv.length < 3)
{
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit()
}

//connection started
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
else if(process.argv.length === 5)
{
    const input_name = process.argv[3]
    const input_number = process.argv[4]

    const person = new Person({
        name: input_name,
        number: input_number,
    })

    person.save().then(result => {
        console.log(`added  ${input_name} number ${input_number} to phonebook`)
        mongoose.connection.close()
    })
}

