require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express')
const crypto = require('crypto');
const app = express()
const port = process.env.PORT || 5001
const { default: axios } = require('axios')

app.use(bodyParser.json())
const cors = require('cors');
app.use(cors())
const commentsByPostIdRecords = [];

app.listen(port, () => console.log('> Comments Server is up and running on port : ' + port))
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostIdRecords[req.params.id] || [])
})
app.post('/events', (req, res) => {
    console.log(req.body)
    console.log("Event received.. : "+req.body.type)
    res.send("Ok:)")
})

app.post('/posts/:id/comments', async (req, res) => {
    let id = crypto.randomBytes(4).toString('hex');
    const { content } = req.body
    let postId = req.params.id
    let comments = commentsByPostIdRecords[postId] || []
    comments.push({ id: id, content })
    commentsByPostIdRecords[postId] = comments
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id:id,
            content,
            postId
        }
    }).then(res=>console.log("CommentCreated event sent..")).catch(err=>console.log(err.message))
    res.status(201).send({ id, content })
})