const register = require('express').Router()
const isAuthentificate = require('./isAuthentificate')
const checkIsAuthentificate = require('./checkIsAuthentificate')
const path = require('path')
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGO_URI


register.get('/register', (req, res) => {
    res.render(path.join(__dirname, '../../views/register/register.pug'));  
});

register.post('/register', async(req, res) => {
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
            res.render(path.join(__dirname, '../../views/register/register.pug'), {msg: "Password & Re Password Not Equal"});  
        }
    }else{
        res.redirect('/404', {msg: "Data Not Correct"})
    }

});


module.exports = register