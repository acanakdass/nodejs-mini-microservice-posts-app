const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');
const { EVENT_BUS_SERVICE_URL } = require('./EventEndpoints');
app.use(cors())
app.use(bodyParser.json())
// !important! 
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv 
const posts = []
app.get('/posts', (req, res) => {
    res.send(posts)
})
const handleEvents = (event) => {
    const { type, data } = event
    console.log("Event received.. : " + type)

    switch (type) {
        case 'PostCreated': {
            let { id, title } = data
            posts.push({ id, title, comments: [] })
            break;
        }
        case 'CommentCreated': {
            let { id, content, postId, status } = data
            let postToUpdate = posts.find(x => x.id == postId)
            postToUpdate.comments.push({ id, content, status })
            break;
        }
        case 'CommentUpdated': {
            let { id, postId, content, status } = data
            let postOfComments = posts.find(x => x.id == postId)
            let comment = postOfComments.comments.find(x => x.id == id)
            comment.status = status
            comment.content = content
            break;
        }
        default:
            break;
    }
}
app.post('/events', (req, res) => {
    handleEvents(req.body)
    res.send("Ok:)")
})
app.listen(port,async () => {
    console.log('> Server is up and running on port : ' + port)
    await axios.get(EVENT_BUS_SERVICE_URL)
    .then(res=>{
        for (let event of res.data) {
            handleEvents(event)
        }
    }).catch(err=>{
        console.log(err.message)
    })
})