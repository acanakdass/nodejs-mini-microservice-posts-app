const express = require('express')
const app = express()
const { default: axios } = require('axios')
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(bodyParser.json())

app.post('/events', async (req, res) => {
    const { type, data } = req.body
    setTimeout(async () => {
        switch (type) {
            case "CommentCreated":
                data.status = data.content.includes('fword') ? 'rejected' : 'approved'
                let eventToSend = {
                    type: 'CommentModerated',
                    data
                }
                await axios.post(process.env.EVENT_BUS_SERVICE_URL, eventToSend).then(res => {
                    console.log("event sent to Service Posts..")
                }).catch(err => console.log(err.message))
                break;

            default:
                break;
        }
        res.send("Ok:)")
    }, 5000)
})


app.listen(port, () => console.log('> Server is up and running on port : ' + port))