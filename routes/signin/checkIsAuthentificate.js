const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = process.env.MONGO_URI

async function checkIsAuthentificate(req,res){
    if(req.cookies.uid){
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }})
        try{
            const findUser = await client.db("paxontools").collection("users").findOne({
                _id: new ObjectId(req.cookies.uid)
            })
            if (typeof findUser === 'object'){
                return true
            }
        }finally{
            await client.close()
        }
    }
}

module.exports = checkIsAuthentificate