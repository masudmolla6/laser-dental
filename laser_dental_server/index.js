const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt=require("jsonwebtoken");
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const verifyToken = require("./middleware/verifyToken");
const verifyAdmin = require("./middleware/verifyAdmin");
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ygkpv0.mongodb.net/?appName=Cluster0`;

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

  const userCollection=client.db("Laser_Dental").collection("users");
  const bannersCollection=client.db("Laser_Dental").collection("banners");
  

  app.get("/secure", verifyToken, (req, res) => {
    console.log("You are Verified.");
    res.send("You are verified user");
  });


  // Admin Related Api
  
  app.get(
    "/admin/users",
    verifyToken,
    verifyAdmin(userCollection),
    async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    }
  );

  app.get(
    "/admin/users/:email",
    verifyToken,
    async (req, res) => {
      try {
        const email = req.params.email;

        // 🔥 FIXED (use req.user)
        if (email !== req.user.email) {
          return res.status(403).send({ message: "Forbidden access" });
        }

        const user = await userCollection.findOne({ email });

        const isAdmin = user?.role === "admin";

        res.send({ isAdmin });

      } catch (error) {
        console.error("ADMIN CHECK ERROR:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    }
  );

  app.post("/users", async (req, res) => {
    const user = req.body;

    // 🔍 check existing user
    const existingUser = await userCollection.findOne({ email: user.email });

    if (existingUser) {
      return res.send({
        message: "User already exists",
      });
    }

    // 🆕 new user insert
    const result = await userCollection.insertOne({
      email: user.email,
      role: "user", // default role
    });

    res.send(result);
  });

  // Banner Related Api

  app.post("/banners", async (req, res) => {
    try {
      const bannerData = req.body;

      // Basic Validation
      if (
        !bannerData.title ||
        !bannerData.accentTitle ||
        !bannerData.subtitle ||
        !bannerData.image
      ) {
        return res.status(400).send({
          success: false,
          message: "Missing required fields",
        });
      }

      // 🔥 Check Existing Banner
      const existingBanner =
        await bannersCollection.findOne({
          title: bannerData.title,
          accentTitle: bannerData.accentTitle,
          image: bannerData.image,
        });

      // If already exists
      if (existingBanner) {
        return res.status(409).send({
          success: false,
          message: "Banner already exists",
        });
      }

      // Add timestamps
      bannerData.createdAt = new Date();
      bannerData.updatedAt = new Date();

      // Save to DB
      const result =
        await bannersCollection.insertOne(
          bannerData
        );

      res.send({
        success: true,
        message: "Banner added successfully",
        insertedId: result.insertedId,
      });
    } catch (error) {
      console.log(error);

      res.status(500).send({
        success: false,
        message: "Failed to add banner",
      });
    }
  });



    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", async(req, res)=>{
    res.send("Laser Dental Point.")
})


app.listen(port, ()=>{
    console.log("Laser Dental Point", port);
})

