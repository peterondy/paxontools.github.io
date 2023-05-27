const user = require('express').Router()
const checkIsAuthentificate = require('../signin/checkIsAuthentificate')
const path = require('path')
const connect = require('../../connect')

async function getOneCdn(title){

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb+srv://peter:WGmiCmoK8xWzXwqI@nodejs.5f7hshu.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });

    try {
        await client.connect();
        //await client.db(paxontools);
        const collection = await client.db("paxontools").collection("CDN-BLOG").findOne({title:title})
        //console.log(collection)
        return collection;
    } finally {
        await client.close();
    }

}

user.get('/user/dashboard', async(req, res)=>{
    if(await checkIsAuthentificate(req,res) === true){
        res.render(path.join(__dirname, '../../views/users/dashboard.pug'))            
    }else{
        res.redirect('/login')
    }
})
user.get('/cdn', async(req,res)=>{
    //if(await checkIsAuthentificate(req,res) === true){
        //await connect("paxontools","CDN-BLOG", {}).then((blogs)=>{
            //res.render(path.join(__dirname, '../../views/users/blog.pug'))//, {blogs})
            res.sendFile(path.join(__dirname, '../../views/users', 'blog.html'))

        //})
        
    //}else{
        //res.redirect('/login')
    //}
})
user.use('/get-cdn/:title', async(req,res)=>{
    res.json(await getOneCdn(req.params.title))
})
module.exports = user