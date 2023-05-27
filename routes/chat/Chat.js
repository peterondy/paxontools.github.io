const Chat = require('express').Router()
const path = require('path')
async function getQuestionsFromMongoDB(){

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
        const collection = await client.db("paxontools").collection("chat").find({}).limit(15).toArray();
        //console.log(collection)
        return collection;
    } finally {
        await client.close();
    }

}
async function getOneQuestionFromMongoDB(question){

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
        const collection = await client.db("paxontools").collection("chat").findOne({"question":question});
        //console.log(collection)
        return collection;
    } finally {
        await client.close();
    }

}
Chat.use('/chat', (req,res)=>{
    //res.render('./chat/chat.pug', {data:"hohoho"})
    res.sendFile(path.join(__dirname, '../../views/chat/', 'index.html'))
})
Chat.use('/get-chat', async (req,res)=>{
    res.json(await getQuestionsFromMongoDB())
})
Chat.use('/getchat/:question', async (req,res)=>{
    //res.json(await getOneQuestionFromMongoDB(req.params))
    console.log(req.params.question)
    if(req.params && req.params != {}){
        if(await getOneQuestionFromMongoDB(req.params.question) === null){
            res.json({msg:"No Data Found"})
        }else{
            //console.log('jajajajaja')
            res.json(await getOneQuestionFromMongoDB(req.params.question))
        }
    }else{
        res.redirect('/404')
    }
})
module.exports = Chat