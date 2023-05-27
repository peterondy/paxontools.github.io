const admin = require('express').Router()
const path = require('path')
const checkIsAuthentificate = require('../signin/checkIsAuthentificate')
const connect = require('../../connect')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = process.env.MONGO_URI


admin.get('/admin/dashboard', async (req,res)=>{
    //console.log(typeof req.cookies.uid)
    if(await checkIsAuthentificate(req,res) === true){
        res.render(path.join(__dirname, '../../views/admin/dashboard/index.pug'))
    }else{
        res.redirect('/login')
    }
})
admin.get('/admin/elements', async (req,res)=>{
    if(await checkIsAuthentificate(req,res) === true){
        res.render(path.join(__dirname, '../../views/admin/elements/index.pug'))
    }else{
        res.redirect('/login')
    }
})
admin.get('/admin/users', async (req,res)=>{
    if(await checkIsAuthentificate(req,res) === true){
        await connect("paxontools","users", {}).then((users)=>{
            res.render(path.join(__dirname, '../../views/admin/users/index.pug'), {users})
        })
    }else{
        res.redirect('/login')
    }
})
admin.get('/admin/users/add', async (req,res)=>{
    if(await checkIsAuthentificate(req,res) === true){
        res.render(path.join(__dirname, '../../views/admin/users/add.pug'))
    }else{
        res.redirect('/login')
    }
})
admin.post('/admin/users/add', async (req,res)=>{
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
                
                res.render(path.join(__dirname, '../../views/admin/users/add.pug'), {msg:"You successfully add new user to MongoDB!"})            
    
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
                
                res.render(path.join(__dirname, '../../views/admin/users/add.pug'), {msg:"You successfully add new user to MongoDB!"})            
    
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
                
                res.render(path.join(__dirname, '../../views/admin/users/add.pug'), {msg:"You successfully add new user to MongoDB!"})            
    
            }else{
                res.render(path.join(__dirname, '../../views/admin/users/add.pug'), {msg:"Data Failed! Please Enter A Valid Again!!!"})            
            }
          } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
          }
    }else{
        res.redirect('/404')
    }
})
admin.get('/admin/users/:username', async(req,res)=>{
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
                res.render(path.join(__dirname, '../../views/admin/users/details.pug'), {user:getUserDetails,data:{logo:"lrg,mlrg,"}})            
            }
        }else{
            res.redirect('/404')           
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
})
admin.get('/admin/users/:username/activate', async(req,res)=>{
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
            res.render(path.join(__dirname, '../../views/admin/users/activate.pug'), {msg:"The user "+req.params.username+" activated"})            
        }else if(activate.activetedstatus == true){
            res.render(path.join(__dirname, '../../views/admin/users/activate.pug'), {msg:"The user only activated"})            
        }
    }
    finally{
        client.close()
    }
})
admin.get('/admin/users/:username/desactivate', async(req,res)=>{
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
            res.render(path.join(__dirname, '../../views/admin/users/desactivate.pug'), {msg:"The user "+req.params.username+" desactivated"})            
        }else if(desactivate.activetedstatus == false){
            res.render(path.join(__dirname, '../../views/admin/users/desactivate.pug'), {msg:"The user only desactivated"})            
        }
    }
    finally{
        client.close()
    }
})
admin.get('/admin/users/:username/delete', async(req,res)=>{
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    try {
        const del = await client.db("paxontools").collection("users").deleteOne({"username":req.params.username})
        res.render(path.join(__dirname, '../../views/admin/users/delete.pug'), {msg:"The user "+req.params.username+" was deleted"})            

    }
    finally{
        client.close()
    }
})
admin.get('/admin/users/:username/edit', async(req,res)=>{
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
                res.render(path.join(__dirname, '../../views/admin/users/edit.pug'),{user})            
            }
        }else{
            res.redirect('/404')           
        }
    }
    finally{
        client.close()
    }
})
admin.post('/admin/users/:username/edit', async(req,res)=>{
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
                res.render(path.join(__dirname, '../../views/admin/users/edit-success.pug'), {msg:"The user "+req.body.oldusername+" was edited"})            
            }
        }else{
            res.redirect('/404')           
        }
    }
    finally{
        client.close()
    }
})
admin.get('/admin/chats/', async(req,res)=>{
    if(await checkIsAuthentificate(req,res) === true){
        await connect("paxontools","chat", {}).then((chats)=>{
            res.render(path.join(__dirname, '../../views/admin/chat/chat.pug'),{chats})
        })
    }else{
        res.redirect('/login')
    }
})
admin.get('/admin/chats/add', async(req,res)=>{
    if(await checkIsAuthentificate(req,res) === true){
        //res.render(path.join(__dirname, '../../views/admin/chat/add.pug'))
        res.sendFile(path.join(__dirname, '../../views/admin/chat/', 'add.html'))
    }else{
        res.redirect('/login')
    }
})
admin.post('/admin/chats/add', async (req,res)=>{
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
                const insertedNewChat = await client.db("paxontools").collection("chat").insertOne({
                    question: req.body.question,
                    response: req.body.response,
                    time: new Date().getMonth() + " - " + new Date().getDay() + " - " + new Date().getFullYear() + " | " + new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + '  America/New_York'
                })
                console.log("You successfully add a new chat to MongoDB!"+insertedNewChat);
                
                res.sendFile(path.join(__dirname, '../../views/admin/chat/', 'add.html'))

          } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
          }
    }else{
        res.redirect('/404')
    }
})
admin.get('/admin/chats/:chatid', async(req,res)=>{
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
    }})
    try{
        const getChatDetails = await client.db("paxontools").collection("chat").findOne({"_id":new ObjectId(req.params.chatid)})
        if (getChatDetails && getChatDetails != null){
            if ( getChatDetails.username == req.params.username){
                res.render(path.join(__dirname, '../../views/admin/chat/details.pug'), {chat:getChatDetails})            
            }
        }else{
            res.redirect('/404')           
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
})
admin.get('/admin/chats/:chatid/delete', async(req,res)=>{
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    try {
        const del = await client.db("paxontools").collection("chat").deleteOne({"_id": new ObjectId(req.params.chatid)})
        res.render(path.join(__dirname, '../../views/admin/chat/delete.pug'), {msg:"The chat was deleted"})            
    }
    finally{
        client.close()
    }
})
module.exports = admin