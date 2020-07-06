const express = require('express')
const app = express()

app.use(express.json())

const PORT = 3001

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123457",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    // Without casting, id would be a string and the find method wouldn't work
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0

    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    console.log(body)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    // Check if person already exists in db
    if (persons.find(p => person.name === p.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    persons = persons.concat(person)

    res.json(person)
})

app.get('/info', (request, response) => {
    response.send(`<p> Phonebook has info for ${persons.length} people </p>
            <p>${new Date()}</p>`)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
