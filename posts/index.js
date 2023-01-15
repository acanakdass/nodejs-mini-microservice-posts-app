require('dotenv').config()
const { default: axios } = require('axios')
const express = require('express')
const crypto = require('crypto');
const port = process.env.PORT || 5000
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const { EVENT_BUS_SERVICE_URL } = require('./EventEndpoints');
app.use(cors())
app.use(bodyParser.json())

const postsRecords = [];

app.listen(port, () => console.log('> Server is up and running on port : ' + port +' :)))'))
app.get('/posts', (req, res) => {
    res.send(postsRecords)
})
app.post('/events', (req, res) => {
    console.log(req.body)
    console.log("Event received.. : "+req.body.type)
    res.send("Ok:)")
})

app.post('/posts',async (req, res) => {
    let id = crypto.randomBytes(4).toString('hex');
    const { title } = req.body
    postsRecords.push({ id, title })
    await axios.post(EVENT_BUS_SERVICE_URL, {
        type: 'PostCreated',
        data: {
            id,
            title
        }
    }).then(res=>console.log("PostCreated event sent..")).catch(err=>console.log(err.message))
    res.status(201).send('post created!')
})