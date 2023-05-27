//const mongoose = require('mongoose')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://peter:WGmiCmoK8xWzXwqI@nodejs.5f7hshu.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


let connect = async function(database, collect, {dataname: datavalue})  {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db(database);
      const collection = await client.db(database).collection(collect).find({dataname: datavalue}).limit(15).toArray();

      console.log("You successfully connected to MongoDB!");
      //console.log(collection)
      return collection;
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
      //console.log("Success")
    }
  }


module.exports = connect