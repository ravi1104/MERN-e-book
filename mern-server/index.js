const express = require('express')
const app = express()
const port = 3001
// const port= process.env.PORT || 500
const cors=require('cors')

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// mongodb configuration // https://cloud.mongodb.com/v2/650980d55edbe73fa4024378#/clusters/connect?clusterId=Cluster0


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.qvkdhhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//<username> - mern-E-book 
// <password> replace -       rJLEYyewR86oizVJ
const uri = "mongodb+srv://mern-E-book:rJLEYyewR86oizVJ@cluster0.qvkdhhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //cerate a collection of documents 
    const bookCollections=client.db("BookInventry").collection("books");
    // name - bookInventry // is name se hamar mongodb me folder ayega  // subfolder - books ka ayega 
    // jispe ham // jo bhi postman ke thow data add kar karnge to hmara mongodb me show hoga

    //insert a book to the db:post  method 
    //https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
    app.post("/upload-book",async(req, res)=>{
        const data=req.body;
        // const haiku = database.collection("haiku");
        // const result = await haiku.insertOne(doc);
        const result=await bookCollections.insertOne(data);
        res.send(result);
    })

// get all books from the database 
//https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/

app.get("/all-books", async(req,res)=>{
const books=bookCollections.find();
const result=await books.toArray();
res.send(result);
}
)

// update a book data:patch or update methods
app.patch("/book/:id",async(req, res)=>{
    const id=req.params.id;
    console.log( "update   id book :",id);
    const updateBookData=req.body;
    // const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); 
    // use - ObjectId
    // jo hmari id use hai -       _id
    const filter={_id:new ObjectId(id)}
    const options = { upsert: true };
    // Specify the update to set a value for the plot field
    const updateDoc = {
      $set: {
        // plot: `A harvest of random numbers, such as: ${Math.random()}`
        ...updateBookData
      },
    };
    //update 
    const result= bookCollections.updateOne(filter,updateDoc,options);
    console.log("update value book  for id:", result);

}
)

// delete a book data
app.delete("/book/:id",async(req,res)=>{
    const id = req.params.id;
    const filter = { _id : new ObjectId(id)};
    const result = await  bookCollections.deleteOne(filter);
    res.send(result);
    console.log( "delete data:",result); 
})

//find by category 
app.get("/all-books",async(req,res)=>{
    let query={};
    if(req.query?.category){
     
            query={category:req.query.category}
      
        const result=await bookCollections.find(query).toArray();
        res.send(result);
        console.log("find  by category :", result);
    }
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //  client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 