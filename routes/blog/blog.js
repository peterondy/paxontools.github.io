const blog = require('express').Router()
const checkIsAuthentificate = require('../signin/checkIsAuthentificate')
const path = require('path')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = process.env.MONGO_URI

blog.get('/admin/blog/add', async(req, res)=>{
    if(await checkIsAuthentificate(req,res) === true){
        res.render(path.join(__dirname, '../../views/scrape/index.html'))
        res.sendFile(path.join(__dirname, '../../views/blog/', 'add.html'))          
    }else{
        res.redirect('/login')
    }
})
blog.post('/admin/blog/add', async(req, res)=>{
    //const js = {title:req.body.title,body:req.body.blogcontent}
    //res.json(js)
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
                const insertNewCdn = await client.db("paxontools").collection("CDN-BLOG").insertOne({
                    title: req.body.title,
                    cdnLink: req.body.blogcontent,
                    time: new Date().getMonth() + " - " + new Date().getDay() + " - " + new Date().getFullYear() + " | " + new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + '  America/New_York'
                })
                console.log("You successfully add a new link to MongoDB!"+insertNewCdn);
                
                res.sendFile(path.join(__dirname, '../../views/blog/', 'add.html'))          

          } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
          }
    }else{
        res.redirect('/404')
    }
})

//users blog
module.exports = blog