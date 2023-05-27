const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = process.env.MONGO_URI
async function isAuthentificate(req,res,url){
    /*if(req.cookies.uid){
        console.log('cette cookie exist',req.cookies.uid)
    }else{
        console.log('cette cookie n\'exist')
        res.cookie('uid',"ofldkf,vldkfvlfvdfv,dkfv,dofkkv", { maxAge: 900000, httpOnly: true });
        res.sendFile(path.join(__dirname, './views/', 'ind.html'))
    }*/
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
            console.log(typeof findUser)
            if (typeof findUser === 'object'){
                
                res.redirect(url)
                
            }else{
                res.redirect("/login")
            }
        }finally{
            await client.close()
        }
    }
}
module.exports = isAuthentificate