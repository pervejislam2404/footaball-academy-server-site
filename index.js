const ObjectID = require("mongodb").ObjectID;
const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.id3ci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("football-academy");
        const featuredCollection = database.collection("featured_post");
        const productsCollection = database.collection("products");
        const addedProductsCollection = database.collection("addedProducts");

        app.get("/featured", async(req, res) => {
            const result = await featuredCollection.find({}).toArray();
            res.json(result);
        })


        app.get("/allProducts", async(req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.json(result);
        })


        app.get("/productById/:id", async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await productsCollection.findOne(query);
            res.json(result)
        })

        app.post("/addedProduct", async(req, res) => {
            const product = req.body;
            const result = await addedProductsCollection.insertOne(product);
            res.json(result);
        })



        app.get("/allOrderedProduct", async(req, res) => {
            const query = {};
            const result = await addedProductsCollection.find(query).toArray();
            res.json(result);
        })


        app.delete("/deleteOrderedProduct/:id", async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await addedProductsCollection.deleteOne(query);
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('server running at port ' + port);
})