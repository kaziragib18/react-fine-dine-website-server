const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txagv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
      try {
            await client.connect();
            // console.log('connected to database');

            const database = client.db('FineDine');
            const servicesCollection = database.collection('services');
            const ordersCollection = database.collection('orders');

            // GET API 
            app.get('/services', async (req, res) => {
                  const cursor = servicesCollection.find({});
                  const services = await cursor.toArray();
                  res.send(services);

            })

            //GET SINGLE SERVICE
            app.get('/services/:id', async (req, res) => {
                  const id = req.params.id;
                  console.log('Getting specific service', id);
                  const query = { _id: ObjectId(id) };
                  const service = await servicesCollection.findOne(query);
                  res.json(service);

            })

            //  //GET SINGLE ORDER
            //  app.get('/orders/:id', async (req, res) => {
            //       const id = req.params.id;
            //       console.log('Getting specific order', id);
            //       const query = { _id: ObjectId(id) };
            //       const order = await ordersCollection.findOne(query);
            //       res.json(order);

            // })

            // POST SERVICES API
            app.post('/services', async (req, res) => {
                  const service = req.body;
                  console.log('hit the post api', service);

                  const result = await servicesCollection.insertOne(service);
                  console.log(result);
                  res.json(result);
            });

            // GET ORDER API
            app.get('/orders', async (req, res) => {
                  const cursor = ordersCollection.find({email:req.query.email});
                  const orders = await cursor.toArray();
                  res.send(orders);

            })

            // POST ORDERS API
            app.post('/orders', async (req, res) => {
                  const order = req.body;
                  console.log('hit the post api', order);
                  const result = await ordersCollection.insertOne(order);
                  console.log(result);
                  res.json(result);
            });


            //DELETE SERVICE API
            app.delete('/services/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) };
                  const result = await servicesCollection.deleteOne(query);
                  // console.log(result);
                  res.json(result);
            })

            //DELETE ORDER API
            app.delete('/orders/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) };
                  const result = await ordersCollection.deleteOne(query);
                  // console.log(result);
                  res.json(result);
            })


      }
      finally {
            //  await client.close();
      }
}

run().catch(console.dir);

app.get('/', (req, res) => {
      res.send('Fine Dine Website Server Running')
});

app.listen(port, () => {
      console.log('Running Fine Dine website server on port', port);
})