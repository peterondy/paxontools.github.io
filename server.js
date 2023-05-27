require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
//const cheerio = require('cheerio')
//const axios = require('axios')
//var session = require('express-session')
//const connect = require('./connect')
//const mongoose = require('mongoose')
//const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
//const fs = require('fs')
//const uri = process.env.MONGO_URI

//import routes
const Chat = require('./routes/chat/Chat')
const Admin = require('./routes/admin/admin')
const User = require('./routes/user/user')
const Login = require('./routes/signin/login')
const Register = require('./routes/signin/register')
const Logout = require('./routes/signin/logout')
const errors = require('./routes/errors/errors')
const contact = require('./routes/contact/contact')
const wordcounter = require('./routes/tools/word-counter')
const scrape = require('./routes/scrape-data/scrape')
const blog = require('./routes/blog/blog')

const port = process.env.PORT || 8000
const link = process.env.LINK + port
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res)=>{
    res.render(__dirname + '/views/index.pug')
})
app.use(Admin)
app.use(errors)
app.use(contact)
app.use(wordcounter)
app.use(Login)
app.use(Register)
app.use(Logout)
app.use(User)
app.use(Chat)
app.use(scrape)
app.use(blog)
app.get('/hhhh', (req,res)=>{
    res.json(app._router.stack)
})
app.listen(port, ()=>{
    console.log(`App running at PORT : ${port}. And it's running at ${link}`)
    //console.log(app._router.stack)
})