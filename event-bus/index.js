const { default: axios } = require('axios')
const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser');
app.use(bodyParser.json())

const events =[]

app.get('/events', (req, res) => {
    res.send(events)
})
const handleEvent = (event)=>{
    switch (event.type) {
        case "CommentCreated":
            sendEvent(process.env.QUERY_SERVICE_URL,"Query",event)
            sendEvent(process.env.MODERATION_SERVICE_URL,"Moderation",event)
            break;
        case "PostCreated":
            sendEvent(process.env.QUERY_SERVICE_URL,"Query",event)
            break;
        case "CommentModerated":
            sendEvent(process.env.COMMENTS_SERVICE_URL,"Comments",event)
            break;
        case "CommentUpdated":
            sendEvent(process.env.QUERY_SERVICE_URL,"Query",event)
            break;
        default:
            sendEvent(process.env.POSTS_SERVICE_URL,"Posts",event)
            sendEvent(process.env.COMMENTS_SERVICE_URL,"Comments",event)
            sendEvent(process.env.QUERY_SERVICE_URL,"Query",event)
            sendEvent(process.env.MODERATION_SERVICE_URL,"Moderation",event)
            break;
    }
}
app.post('/events', async (req, res) => {
    const event = req.body;
    events.push(event)
    console.log(event)
    handleEvent(event)
    
    res.send({status:'OK'})
})


const sendEvent=async (url,serviceName,event)=>{
    await axios.post(url,event).then(res=>console.log(`event sent to Service ${serviceName}..`)).catch(err=>console.log(err.message))
}
app.listen(port, () => {
    console.log('> Server is up and running on port : ' + port)
})