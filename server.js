require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [{ username: "Moshe", title: "Post 1" }, { username: "Sara", title: "Post 1" }]

app.listen(port)


app.get('/posts', authenticateToken, (req, res) => {
    console.log(req.user.name);
    res.json(posts.filter(post => post.username === req.user.name))
})


app.post('/login', (req, res) => {
    // Authentication User

    const username = req.body.username
    const user = { name: username }

    const accessToken = jwt.sign(user, process.env.ACCSES_TOKEN_SECRET)
    res.json({ accessToken: accessToken })

})

function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCSES_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })

}