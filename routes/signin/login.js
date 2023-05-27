const login = require('express').Router()
//const isAuthentificate = require('../signin/isAuthentificate')
const path = require('path')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = process.env.MONGO_URI

login.get('/login', (req, res) => {
    res.render(path.join(__dirname, '../../views/login/login.pug'));  
});

login.post('/login', async (req, res) => {
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
            const getUser = await client.db("paxontools").collection("users").findOne({
                username: req.body.username
            })
            //console.log("You successfully get user from MongoDB!");
            if(getUser.username == req.body.username && getUser.password == req.body.password){
                if(getUser.activetedstatus == false){
                    res.render(path.join(__dirname, '../../views/login/login.pug'), {msg: "This User not Activeted"});
                }else if(getUser.activetedstatus == true){
                    if(getUser.useraccess == "useradminfullaccess"){
                        res.cookie('uid',getUser._id, { maxAge: 900000, httpOnly: true });
                        res.redirect('/admin/dashboard')
                    }else{
                        res.cookie('uid',getUser._id, { maxAge: 900000, httpOnly: true });
                        res.redirect('/user/dashboard')
                    }
                }
            }else{
                res.render(path.join(__dirname, '../../views/login/login.pug'), {msg: "User Or Password Not Correct"});
            }

          } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
          }
    }else{
        res.redirect('/404', {msg: "Data Not Correct"})
    }
});


module.exports = login