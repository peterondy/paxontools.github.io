require('dotenv').config()
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const path = require('path')
const bodyParser = require('body-parser')
var session = require('express-session')
const connect = require('./connect')
//const mongoose = require('mongoose')
const { MongoClient, ServerApiVersion } = require('mongodb')
const nodemailer = require('nodemailer')
const fs = require('fs')

const uri = process.env.MONGO_URI

const port = process.env.PORT || 8000
const link = process.env.LINK + port
const app = express()
const router = express.Router()

const timeExpire = 24 * 60 * 60 * 1000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use(session({
    secret: 'oedfijhdfkjghfg875684854DFDFODFOLBFgb545454',
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + timeExpire),
        maxAge : timeExpire
    }
}))

//Functions
function isAuthentificate(req,res,url,type){
    /*if(type=="admin"){
        if(req.session.admin || req.session.admin != undefined || req.session.admin != null){
            res.redirect(url)
        }else{
            res.redirect("/login")
        }
    }else if(type=="user"){
        if(req.session.user || req.session.user != undefined || req.session.user != null){
            res.redirect(url)
        }else{
            res.redirect("/login")
        }
    }*/
    

}
function checkIsAuthentificate(req,res){
    if(req.session.user || req.session.user != undefined || req.session.user != null){
        return true
    }else{
        return false
    }
}



//Home Route
app.get('/', (req, res)=>{
    if (checkIsAuthentificate(req,res)){
        console.log(req.session.admin || req.session.user)
        isAuthentificate(req,res,"/user/dashboard")
    }else{
        console.log(req.session.admin || req.session.user)
        res.render(__dirname + '/routes/index.pug')
    }
})
//admin routes

app.get('/admin/dashboard', async (req,res)=>{
    res.render(path.join(__dirname, './routes/admin/dashboard/index.pug'))
})
app.get('/admin/elements', async (req,res)=>{
            res.render(path.join(__dirname, './routes/admin/elements/index.pug'))
})
app.get('/admin/users', async (req,res)=>{
    await connect("paxontools","users", {}).then((users)=>{
        res.render(path.join(__dirname, './routes/admin/users/index.pug'), {users})
    })
})
app.get('/admin/users/add', async (req,res)=>{
    res.render(path.join(__dirname, './routes/admin/users/add.pug'))
})
app.post('/admin/users/add', async (req,res)=>{
    if(req.body){
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(uri, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
        });
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            if (req.body.useraccess == "useradminfullaccess"){
                const insertedNewUser = await client.db("paxontools").collection("admin").insertOne({
                    email: req.body.email,
                    username: req.body.username,
                    fullname: req.body.fullname,
                    useraccess: req.body.useraccess,
                    activetedstatus: true,
                    password: req.body.password,
                    time: new Date().getMonth() + " - " + new Date().getDay() + " - " + new Date().getFullYear() + " | " + new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + '  America/New_York'
                })
                console.log("You successfully add new admin to MongoDB!"+insertedNewUser);
                
                res.render(path.join(__dirname, './routes/admin/users/add.pug'), {msg:"You successfully add new user to MongoDB!"})            
    
            }else if(req.body.useraccess == "userpartadmin"){
                const insertedNewUser = await client.db("paxontools").collection("admin").insertOne({
                    email: req.body.email,
                    username: req.body.username,
                    fullname: req.body.fullname,
                    useraccess: req.body.useraccess,
                    activetedstatus: true,
                    password: req.body.password,
                    time: new Date().getMonth() + " - " + new Date().getDay() + " - " + new Date().getFullYear() + " | " + new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + '  America/New_York'
                })
                console.log("You successfully add new admin to MongoDB!");
                
                res.render(path.join(__dirname, './routes/admin/users/add.pug'), {msg:"You successfully add new user to MongoDB!"})            
    
            }else if(req.body.useraccess == "useronly" || req.body.useraccess == "usercontact"){
                const insertedNewUser = await client.db("paxontools").collection("users").insertOne({
                    email: req.body.email,
                    username: req.body.username,
                    fullname: req.body.fullname,
                    useraccess: req.body.useraccess,
                    activetedstatus: true,
                    password: req.body.password,
                    time: new Date().getMonth() + " - " + new Date().getDay() + " - " + new Date().getFullYear() + " | " + new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + '  America/New_York'
                })
                console.log("You successfully add new user to MongoDB!");
                
                res.render(path.join(__dirname, './routes/admin/users/add.pug'), {msg:"You successfully add new user to MongoDB!"})            
    
            }else{
                res.render(path.join(__dirname, './routes/admin/users/add.pug'), {msg:"Data Failed! Please Enter A Valid Again!!!"})            
            }
          } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
          }
    }else{
        res.redirect('/404')
    }
})
app.get('/admin/users/:username', async(req,res)=>{
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
    }})
    try{
        const getUserDetails = await client.db("paxontools").collection("users").findOne({"username":req.params.username})
        if (getUserDetails && getUserDetails != null){
            if ( getUserDetails.username == req.params.username){
                res.render(path.join(__dirname, './routes/admin/users/details.pug'), {user:getUserDetails,data:{logo:"lrg,mlrg,"}})            
            }
        }else{
            res.redirect('/404')           
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
})
app.get('/admin/users/:username/activate', async(req,res)=>{
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    try {
        const activate = await client.db("paxontools").collection("users").findOne({"username":req.params.username})
        if(activate.activetedstatus == false){
            activate.activetedstatus = true
            const success = await client.db("paxontools").collection("users").replaceOne({"username":req.params.username},activate)
            res.render(path.join(__dirname, './routes/admin/users/activate.pug'), {msg:"The user "+req.params.username+" activated"})            
        }else if(activate.activetedstatus == true){
            res.render(path.join(__dirname, './routes/admin/users/activate.pug'), {msg:"The user only activated"})            
        }
    }
    finally{
        client.close()
    }
})
app.get('/admin/users/:username/desactivate', async(req,res)=>{
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    try {
        const desactivate = await client.db("paxontools").collection("users").findOne({"username":req.params.username})
        if(desactivate.activetedstatus == true){
            desactivate.activetedstatus = false
            const success = await client.db("paxontools").collection("users").replaceOne({"username":req.params.username},desactivate)
            res.render(path.join(__dirname, './routes/admin/users/desactivate.pug'), {msg:"The user "+req.params.username+" desactivated"})            
        }else if(desactivate.activetedstatus == false){
            res.render(path.join(__dirname, './routes/admin/users/desactivate.pug'), {msg:"The user only desactivated"})            
        }
    }
    finally{
        client.close()
    }
})
app.get('/admin/users/:username/delete', async(req,res)=>{
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    try {
        const del = await client.db("paxontools").collection("users").deleteOne({"username":req.params.username})
        res.render(path.join(__dirname, './routes/admin/users/delete.pug'), {msg:"The user "+req.params.username+" was deleted"})            

    }
    finally{
        client.close()
    }
})
app.get('/admin/users/:username/edit', async(req,res)=>{
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    try {
        const user = await client.db("paxontools").collection("users").findOne({"username":req.params.username})
        if (user && user != null){
            if ( user.username == req.params.username){
                res.render(path.join(__dirname, './routes/admin/users/edit.pug'),{user})            
            }
        }else{
            res.redirect('/404')           
        }
    }
    finally{
        client.close()
    }
})

app.post('/admin/users/:username/edit', async(req,res)=>{
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    try {
        const userFind = await client.db("paxontools").collection("users").findOne({"username":req.body.oldusername})
        //console.log(userFind,req.body.username,req.body.oldusername)
        if (userFind && userFind != null){
            if ( userFind.username == req.body.username){
                userFind={
                    email: req.body.email,
                    username: req.body.username,
                    fullname: req.body.fullname,
                    useraccess: req.body.useraccess,
                    activetedstatus: req.body.activetedstatus
                }  
                const editUser = await client.db("paxontools").collection("users").updateOne({"username":req.body.oldusername},userFind)
                //console.log(editUser)
                res.render(path.join(__dirname, './routes/admin/users/edit-success.pug'), {msg:"The user "+req.body.oldusername+" was edited"})            
            }
        }else{
            res.redirect('/404')           
        }
    }
    finally{
        client.close()
    }
})
//errors routes
app.get('/404', (req, res)=>{
    return res.status(404).sendFile(path.join(__dirname, '/routes/errors/404.html'));
})
//contact Form
app.get('/contact', async(req,res)=>{
    res.render(path.join(__dirname, './routes/contact/contact.pug'))

})
app.post('/contact', async(req,res)=>{
    //res.render(path.join(__dirname, './routes/contact/contact.pug'))
    if(!req.body){
        return res.render(path.join(__dirname, './routes/contact/contact.pug'), {msg: 'Data Not Found'})
    }
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mysocialmedi123@gmail.com',
            pass: 'pmvcvqmpwmnniuru'
        }
    })
    let mailOptions = {
        from: "peterondy.freelance@gmail.com",
        to: 'ramzibenchadi5@gmail.com',
        subject: req.body.subject,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (err,info)=>{
        if (err){
            console.log(err)
            res.render(path.join(__dirname, './routes/contact/contact.pug'), {msg:'Email Send Failed To Admin'})
        }else{
            console.log('start ' + info.response)
            res.render(path.join(__dirname, './routes/contact/contact.pug'), {msg:'Email Send Success To Admin'})
        }
    })
})

app.get('/word-counter', (req, res)=>{
    return res.sendFile(path.join(__dirname, '/routes/word-counter/word-counter.html'));
})

app.get('/login', (req, res) => {
    if (checkIsAuthentificate(req,res)){
        isAuthentificate(req,res,"/user/dashboard")
    }else{
        res.render(path.join(__dirname, './routes/login/login.pug'));
    }
    
});

app.post('/login', async (req, res) => {
    if(req.body){
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(uri, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
        });
        try {
            if (checkIsAuthentificate(req,res)){
                isAuthentificate(req,res,"/user/dashboard")
            }else{
                // Connect the client to the server	(optional starting in v4.7)
                await client.connect();
                // Send a ping to confirm a successful connection
                const getUser = await client.db("paxontools").collection("users").findOne({
                    username: req.body.username
                })
                console.log("You successfully get user from MongoDB!");
                if(getUser.username == req.body.username && getUser.password == req.body.password){
                    if(getUser.activetedstatus == false){
                        res.render(path.join(__dirname, './routes/login/login.pug'), {msg: "This User not Activeted"});
                    }else if(getUser.activetedstatus == true){
                        if(getUser.useraccess == "useradminfullaccess"){
                            req.session.admin = {
                                email    : getUser.email,
                                username : getUser.username,
                                fullname : getUser.fullname,
                                password : getUser.password
                            }
                            process.env.USER={
                                email    : getUser.email,
                                username : getUser.username,
                                fullname : getUser.fullname,
                                password : getUser.password
                            }
                            isAuthentificate(req,res,"/admin/dashboard","admin")
                        }else{
                            req.session.user = {
                                email    : getUser.email,
                                username : getUser.username,
                                fullname : getUser.fullname,
                                password : getUser.password
                            }
                            isAuthentificate(req,res,"/user/dashboard","user")
                        }
                    }
                }else{
                    res.render(path.join(__dirname, './routes/login/login.pug'), {msg: "User Or Password Not Correct"});
                }
            }
            
            //res.render(path.join(__dirname, './routes/admin/users/add.pug'), {msg:"You successfully add new user to MongoDB!"})            

          } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
          }
    }else{
        res.redirect('/404', {msg: "Data Not Correct"})
    }
});

app.get('/register', (req, res) => {
    if (checkIsAuthentificate(req,res)){
        isAuthentificate(req,res,"/user/dashboard")
    }else{
        res.render(__dirname + '/routes/register/register.pug')
    }
});

app.post('/register', async(req, res) => {
    if (req.body){
        if (req.body.password == req.body.repassword){
            const client = new MongoClient(uri, {
                serverApi: {
                  version: ServerApiVersion.v1,
                  strict: true,
                  deprecationErrors: true,
                }
            })
            try {
                // Connect the client to the server	(optional starting in v4.7)
                await client.connect();
                // Send a ping to confirm a successful connection
                const getUser = await client.db("paxontools").collection("users").findOne({
                    username: req.body.username
                })
                if(getUser == null){
                    const insertedNewUser = await client.db("paxontools").collection("users").insertOne({
                        email: req.body.email,
                        username: req.body.username,
                        fullname: req.body.fullname,
                        useraccess: "useronly",
                        activetedstatus: false,
                        password: req.body.password,
                        time: new Date().getMonth() + " - " + new Date().getDay() + " - " + new Date().getFullYear() + " | " + new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + '  America/New_York'
                    })
                    res.redirect("/login")
                }    
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close();
            }
        }else{
            res.render(__dirname + '/routes/register/register.pug', {msg: "Password & Re Password Not Equal"})
        }
    }else{
        res.redirect('/404', {msg: "Data Not Correct"})
    }

});

app.get('/logout', (req,res)=>{
    req.session.user = {}
    //req.logout()
    console.log(req.session.user)
    isAuthentificate(req,res,'/login')
})

app.get('/user/dashboard', (req, res)=>{
    if (checkIsAuthentificate(req,res)){
        res.render(__dirname + '/routes/users/dashboard.pug')
    }else{
        isAuthentificate(req,res,"/login")
    }
})


app.listen(port, ()=>{
    console.log(`App running at PORT : ${port}. And it's running at ${link}`)
})