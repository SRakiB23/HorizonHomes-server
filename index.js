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
    const userCollection = client.db("propertyDB").collection("users");

    //property API
    app.get("/properties", async (req, res) => {
      const cursor = propertyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/properti", async (req, res) => {
      try {
        const cursor = propertyCollection.find({
          verification_status: "verified",
        });
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).send({ error: "Failed to fetch properties" });
      }
    });

    app.get("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.findOne(query);
      res.send(result);
    });
    app.get("/property", async (req, res) => {
      const email = req.query.email;
      const query = { agent_email: email };
      const result = await propertyCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/properties", async (req, res) => {
      const newProperty = req.body;
      console.log(newProperty);
      const result = await propertyCollection.insertOne(newProperty);
      res.send(result);
    });

    app.patch("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const UpdateProperties = req.body;
      const property = {
        $set: {
          property_name: UpdateProperties.property_name,
          image: UpdateProperties.image,
          location: UpdateProperties.location,
          agent_name: UpdateProperties.agent_name,
          agent_email: UpdateProperties.agent_email,
          agent_image: UpdateProperties.agent_image,
          verification_status: UpdateProperties.verification_status,
          price_range: UpdateProperties.price_range,
        },
      };
      const result = await propertyCollection.updateOne(filter, property);
      res.send(result);
    });

    // Server-side code
    app.patch("/propertiess/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { verification_status } = req.body;

        // Update only the 'status' field of the document with the specified '_id'
        const result = await propertyCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { verification_status: verification_status } } // Use $set to update only the 'status' field
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: "Status updated successfully" });
        } else {
          res
            .status(400)
            .send({ success: false, message: "Failed to update status" });
        }
      } catch (error) {
        console.error("Error verifying status:", error);
        res.status(500).send({ error: "Failed to update status" });
      }
    });

    app.delete("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.deleteOne(query);
      res.send(result);
    });

    //Review API
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
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
    app.get("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishListCollection.findOne(query);
      res.send(result);
    });

    app.get("/wishlist", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await wishListCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/wishlistt", async (req, res) => {
      const email = req.query.email;
      const query = { agent_email: email };
      const result = await wishListCollection.find(query).toArray();
      res.send(result);
    });

    app.patch("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateWishlist = req.body;
      const wishlist = {
        $set: {
          property_name: updateWishlist.property_name,
          image: updateWishlist.image,
          location: updateWishlist.location,
          agent_name: updateWishlist.agent_name,
          agent_image: updateWishlist.agent_image,
          verification_status: updateWishlist.verification_status,
          buyingDate: updateWishlist.buyingDate,
          price_range: updateWishlist.price_range,
          user_name: updateWishlist.user_name,
          email: updateWishlist.email,
          offered_price: updateWishlist.offered_price,
          status: updateWishlist.status,
        },
      };
      const result = await wishListCollection.updateOne(filter, wishlist);
      res.send(result);
    });

    app.patch("/wishlistt/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;

        // Update only the 'status' field of the document with the specified '_id'
        const result = await wishListCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: status } } // Use $set to update only the 'status' field
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: "Status updated successfully" });
        } else {
          res
            .status(400)
            .send({ success: false, message: "Failed to update status" });
        }
      } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).send({ error: "Failed to update status" });
      }
    });

    app.delete("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishListCollection.deleteOne(query);
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

    ////users Api
    app.post("/users", async (req, res) => {
      const user = req.body;
      // insert email if user doesnt exists:
      // you can do this many ways (1. email unique, 2. upsert 3. simple checking)
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/agent/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let agent = false;
      if (user) {
        agent = user?.role === "agent";
      }
      res.send({ agent });
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });

    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.patch("/users/agent/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "agent",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.patch("/users/agentt/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "fraud",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
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
