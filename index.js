const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.yjorklr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const productCollection=client.db('brandShop').collection('productDetails');
    
    app.post('/products', async(req, res)=>{
        newProduct= req.body;
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    })

    app.get('/products', async(req, res)=>{
        const cursor= productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/products/:id', async(req, res)=>{
      console.log('hello');
      const id= req.params.id;
      console.log(id);

      const query= {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
      console.log(result);
  })

    app.get('/products/:brandName', async(req, res)=>{
      const brandName= req.params.brandName;
      const query= {brandName:brandName};
      const result = await productCollection.find(query).toArray();
      res.send(result);
  })
  

   
   

    // app.put('/products/:id', async(req, res)=>{
    //     const id = req.params.id;
    //         const filter = { _id: new ObjectId(id) }
    //         const options = { upsert: true };
    //         const updatedProduct = req.body;
    //         {name, brandName, types, rating, price, image,_id, description}
    //         const product = {
    //             $set: {
    //                 name: updatedProduct.name,
    //                 quantity: updatedProduct.brandName,
    //                 supplier: updatedProduct.types,
    //                 taste: updatedProduct.rating,
    //                 category: updatedProduct.price,
    //                 details: updatedProduct.image,
    //                 photo: updatedProduct.description
    //             }
    //         }

    //         const result = await coffeeCollection.updateOne(filter, product, options);
    //         res.send(result);
    //     })

   

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })