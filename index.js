const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// mongoDB connection
const uri =
  "mongodb+srv://SmartDealsDB:ZtPAljlvsKg7lh68@cluster0.96upm.mongodb.net/?appName=Cluster0";
// mongo client setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// run function to connect to DB
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Database operations can be performed here
    // making db and collection
    const database = client.db("SmartDealsDB");
    const productsCollection = database.collection("products");
    const bidsCollection = database.collection("bidCollection");
    const userCollection = database.collection("user");

    // User related apis
    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await userCollection.insertOne(users);
      res.send(result);
    });

    // get all products
    app.get("/products", async (req, res) => {
      console.log(req.query);
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const corsor = productsCollection.find(query);
      const result = await corsor.toArray();
      res.send(result);
    });

    // find one products
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });
    // API for getting products
    app.post("/products", async (req, res) => {
      const allProducts = req.body;
      const result = await productsCollection.insertOne(allProducts);
      res.send(result);
    });

    // patch products
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
        },
      };
      const result = await productsCollection.updateOne(query, update);
      res.send(result);
    });

    // delete product API
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // bid realeted API
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.buyer_email = email;
      }

      const corsor = bidsCollection.find(query);
      const result = await corsor.toArray();
      res.send(result);
    });

    // post bids
    app.post("/bids", async (req, res) => {
      const newBids = req.body;
      const result = await bidsCollection.insertOne(newBids);
      res.send(result);
    });

    // confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
