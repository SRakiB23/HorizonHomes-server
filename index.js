const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const corsConfig = {
  origin: "*",
  Credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.552onl4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const propertyCollection = client.db("propertyDB").collection("properties");
    const reviewCollection = client.db("propertyDB").collection("reviews");
    const wishListCollection = client.db("propertyDB").collection("wishList");

    //property API
    app.get("/properties", async (req, res) => {
      const cursor = propertyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.findOne(query);
      res.send(result);
    });

    //Review API
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const newReviews = req.body;
      console.log(newReviews);
      const result = await reviewCollection.insertOne(newReviews);
      res.send(result);
    });

    //wishlist api
    app.post("/wishlist", async (req, res) => {
      const newWishList = req.body;
      console.log(newWishList);
      const result = await wishListCollection.insertOne(newWishList);
      res.send(result);
    });

    //compare
    app.get("/reviews/:id", async (req, res) => {
      const propertyId = req.params.id;
      const property = await propertyCollection.findOne({
        _id: new ObjectId(propertyId),
      });
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      const propertyName = property.property_name;
      //fetch reviews match
      const reviews = await reviewCollection
        .find({ property_name: propertyName })
        .toArray();
      res.json(reviews);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("HorizonHomes is running");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
