const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const verifyToken = require("./middleware/verifyToken");
const verifyAdmin = require("./middleware/verifyAdmin");
const port = process.env.PORT || 5000;

// ── Middlewares ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ygkpv0.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // ✅ Connect FIRST
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");

    // ── Collections ────────────────────────────────────────────────────
    const userCollection    = client.db("Laser_Dental").collection("users");
    const bannersCollection = client.db("Laser_Dental").collection("banners");
    const galleryCollection = client.db("Laser_Dental").collection("gallery");

    // ── Test route ─────────────────────────────────────────────────────
    app.get("/secure", verifyToken, (req, res) => {
      res.send("You are verified user");
    });

    // ══════════════════════════════════════════════════════════════════
    // USER ROUTES
    // ══════════════════════════════════════════════════════════════════
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        const existingUser = await userCollection.findOne({ email: user.email });
        if (existingUser) return res.send({ message: "User already exists" });
        const result = await userCollection.insertOne({
          email: user.email,
          role: "user",
        });
        res.send(result);
      } catch (error) {
        console.error("POST /users:", error);
        res.status(500).send({ message: "Failed to create user" });
      }
    });

    // ══════════════════════════════════════════════════════════════════
    // ADMIN ROUTES
    // ══════════════════════════════════════════════════════════════════
    app.get("/admin/users", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch users" });
      }
    });

    app.get("/admin/users/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        if (email !== req.user.email) return res.status(403).send({ message: "Forbidden access" });
        const user = await userCollection.findOne({ email });
        res.send({ isAdmin: user?.role === "admin" });
      } catch (error) {
        console.error("ADMIN CHECK:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // ══════════════════════════════════════════════════════════════════
    // BANNER ROUTES
    // ══════════════════════════════════════════════════════════════════
    app.get("/banners", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const result = await bannersCollection.find().sort({ createdAt: -1 }).toArray();
        res.send({ success: true, banners: result });
      } catch (error) {
        res.status(500).send({ success: false, message: "Failed to fetch banners" });
      }
    });

    app.post("/banners", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const bannerData = req.body;
        if (!bannerData.title || !bannerData.accentTitle || !bannerData.subtitle || !bannerData.image) {
          return res.status(400).send({ success: false, message: "Missing required fields" });
        }
        const existing = await bannersCollection.findOne({
          title: bannerData.title,
          accentTitle: bannerData.accentTitle,
          image: bannerData.image,
        });
        if (existing) return res.status(409).send({ success: false, message: "Banner already exists" });
        bannerData.createdAt = new Date();
        bannerData.updatedAt = new Date();
        const result = await bannersCollection.insertOne(bannerData);
        res.send({ success: true, message: "Banner added successfully", insertedId: result.insertedId });
      } catch (error) {
        console.error("POST /banners:", error);
        res.status(500).send({ success: false, message: "Failed to add banner" });
      }
    });

    app.patch("/banners/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id = req.params.id;
        const update = req.body;
        delete update._id;
        update.updatedAt = new Date();
        const result = await bannersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: update }
        );
        res.send({ success: true, modifiedCount: result.modifiedCount });
      } catch (error) {
        console.error("PATCH /banners:", error);
        res.status(500).send({ success: false, message: "Failed to update banner" });
      }
    });

    app.delete("/banners/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id = req.params.id;
        const result = await bannersCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).send({ success: false, message: "Banner not found" });
        }
        res.send({ success: true, message: "Banner deleted successfully" });
      } catch (error) {
        console.error("DELETE /banners:", error);
        res.status(500).send({ success: false, message: "Failed to delete banner" });
      }
    });

    // ══════════════════════════════════════════════════════════════════
    // GALLERY ROUTES
    // ══════════════════════════════════════════════════════════════════

    // GET all — public (for website gallery page)
    app.get("/gallery", async (req, res) => {
      try {
        const { category, status } = req.query;
        const filter = {};
        if (category) filter.category = category;
        filter.status = status || "published";

        const result = await galleryCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .toArray();

        res.send({ success: true, gallery: result, total: result.length });
      } catch (error) {
        console.error("GET /gallery:", error);
        res.status(500).send({ success: false, message: "Failed to fetch gallery" });
      }
    });

    // GET all for admin — includes drafts
    app.get("/admin/gallery", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const result = await galleryCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();
        res.send({ success: true, gallery: result, total: result.length });
      } catch (error) {
        console.error("GET /admin/gallery:", error);
        res.status(500).send({ success: false, message: "Failed to fetch gallery" });
      }
    });

    // GET single by ID
    app.get("/gallery/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const item = await galleryCollection.findOne({ _id: new ObjectId(id) });
        if (!item) return res.status(404).send({ success: false, message: "Not found" });
        res.send({ success: true, item });
      } catch (error) {
        console.error("GET /gallery/:id:", error);
        res.status(500).send({ success: false, message: "Failed to fetch item" });
      }
    });

    // POST — add new case study
    app.post("/gallery", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const data = req.body;

        // Validation
        if (!data.title || !data.images?.main) {
          return res.status(400).send({ success: false, message: "Title and main image are required" });
        }

        data.createdAt = new Date();
        data.updatedAt = new Date();

        const result = await galleryCollection.insertOne(data);
        res.send({
          success: true,
          message: "Case study added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("POST /gallery:", error);
        res.status(500).send({ success: false, message: "Failed to add case study" });
      }
    });

    // PATCH — update (status toggle, edit)
    app.patch("/gallery/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id = req.params.id;
        const update = req.body;
        delete update._id;
        update.updatedAt = new Date();

        const result = await galleryCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: update }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ success: false, message: "Item not found" });
        }

        res.send({ success: true, message: "Updated successfully", modifiedCount: result.modifiedCount });
      } catch (error) {
        console.error("PATCH /gallery/:id:", error);
        res.status(500).send({ success: false, message: "Failed to update" });
      }
    });

    // DELETE
    app.delete("/gallery/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id = req.params.id;
        const result = await galleryCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).send({ success: false, message: "Item not found" });
        }

        res.send({ success: true, message: "Deleted successfully" });
      } catch (error) {
        console.error("DELETE /gallery/:id:", error);
        res.status(500).send({ success: false, message: "Failed to delete" });
      }
    });

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// ── Root ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Laser Dental Point API ✅");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
