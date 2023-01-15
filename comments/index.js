require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express')
const crypto = require('crypto');
const app = express()
const port = process.env.PORT || 5001
const { default: axios } = require('axios')

app.use(bodyParser.json())
const cors = require('cors');
const { EVENT_BUS_SERVICE_URL } = require('./EventEndpoints');
app.use(cors())
const commentsByPostIdRecords = [];

app.listen(port, () => console.log('> Comments Server is up and running on port : ' + port))
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostIdRecords[req.params.id] || [])
})
app.post('/events',async (req, res) => {
    const { type, data } = req.body
    switch (type) {
        case 'CommentModerated': {
            let commentsArr = commentsByPostIdRecords[data.postId]
            var { id, postId, status } = data
            let comment = commentsArr.find(x => x.id == id)
            comment.status = status
            let eventToSend = {
                type: 'CommentUpdated',
                data
            }
            sendEventAsync(EVENT_BUS_SERVICE_URL,'Event Bus',eventToSend)
            break;
        }
        default:
            break;
    }
    console.log("Event received.. : " + req.body.type)
    res.send("Ok:)")
})

app.post('/posts/:id/comments', async (req, res) => {
    let id = crypto.randomBytes(4).toString('hex');
    const { content } = req.body
    let postId = req.params.id
    let comments = commentsByPostIdRecords[postId] || []
    comments.push({ id: id, content, status: 'pending' })
    commentsByPostIdRecords[postId] = comments

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: { id, content, postId, status: 'pending' }
    }).then(res => console.log("CommentCreated event sent..")).catch(err => console.log(err.message))

    res.status(201).send({ id, content })
})

const sendEventAsync=async (url,serviceName,event)=>{
    await axios.post(url,event).then(res=>console.log(`event sent to Service ${serviceName}..`)).catch(err=>console.log(err.message))
}