const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors())
app.use(bodyParser.json())
// !important! 
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv 
const posts = []
app.get('/posts', (req, res) => {
    res.send(posts)
})
app.post('/events', (req, res) => {
    const { type, data } = req.body
    console.log("Event received.. : " + type)
    switch (type) {
        case 'PostCreated':
            var { id, title } = data
            posts.push({ id, title, comments: [] })
            console.log('posts')
            console.log(posts)
            break;
        case 'CommentCreated':
            var { id, content, postId } = data
            let postToUpdate = posts.find(x=>x.id==postId)
            postToUpdate.comments.push({ id, content })
            break;
        default:
            break;
    }
    res.send("Ok:)")
})
app.listen(port, () => console.log('> Server is up and running on port : ' + port))