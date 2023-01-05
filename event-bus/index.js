const { default: axios } = require('axios')
const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser');
const { QUERY_SERVICE_URL, COMMENTS_SERVICE_URL, MODERATION_SERVICE_URL, POSTS_SERVICE_URL } = require('../EventEndpoints')
app.use(bodyParser.json())
// !important! 
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv 

app.get('/', (req, res) => {
    res.send('hello from simple server :)')
})
app.post('/events', async (req, res) => {
    const event = req.body;
    console.log(event)
    switch (event.type) {
        case "CommentCreated":
            sendEvent(QUERY_SERVICE_URL,"Query",event)
            sendEvent(MODERATION_SERVICE_URL,"Moderation",event)
            break;
        case "PostCreated":
            sendEvent(QUERY_SERVICE_URL,"Query",event)
            break;
        case "CommentModerated":
            sendEvent(COMMENTS_SERVICE_URL,"Comments",event)
            break;
        case "CommentUpdated":
            sendEvent(QUERY_SERVICE_URL,"Query",event)
            break;
        default:
            sendEvent(POSTS_SERVICE_URL,"Posts",event)
            sendEvent(COMMENTS_SERVICE_URL,"Comments",event)
            sendEvent(QUERY_SERVICE_URL,"Query",event)
            sendEvent(MODERATION_SERVICE_URL,"Moderation",event)
            break;
    }
    res.send({status:'OK'})
})


const sendEvent=async (url,serviceName,event)=>{
    await axios.post(url,event).then(res=>console.log(`event sent to Service ${serviceName}..`)).catch(err=>console.log(err.message))
}
app.listen(port, () => {
    console.log('> Server is up and running on port : ' + port)
})