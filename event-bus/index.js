const { default: axios } = require('axios')
const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser');
app.use(bodyParser.json())
// !important! 
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv 

app.get('/', (req, res) => {
    res.send('hello from simple server :)')
})
app.post('/events', (req, res) => {
    const event = req.body;
    console.log(event)
    axios.post('http://localhost:4000/events',event).then(res=>console.log("event sent to Service Posts..")).catch(err=>console.log(err.message))
    axios.post('http://localhost:4001/events',event).then(res=>console.log("event sent to Service Comments.. ")).catch(err=>console.log(err.message))
    axios.post('http://localhost:4002/events',event).then(res=>console.log("event sent to Service Query.. ")).catch(err=>console.log(err.message))
    // axios.post('http://localhost:4002/events',event)
    res.send({status:'OK'})
})

app.listen(port, () => console.log('> Server is up and running on port : ' + port))