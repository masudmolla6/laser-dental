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

// ── Vercel serverless e MongoDB connection cache ───────────────────────────
// Serverless function বারবার নতুন instance এ চলতে পারে — তাই connect() বারবার
// call হলে MongoDB Atlas এ "too many connections" error আসতে পারে।
// global e connection promise cache করে রাখলে একই connection reuse হয়।
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("✅ Connected to MongoDB!");
  isConnected = true;
}

// সব route এর আগে DB connect নিশ্চিত করা (cached হলে সাথে সাথেই এগিয়ে যাবে)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection error:", error);
    res.status(500).send({ message: "Database connection failed" });
  }
});

// ── Collections ────────────────────────────────────────────────────────────
const userCollection = client.db("Laser_Dental").collection("users");
const bannersCollection = client.db("Laser_Dental").collection("banners");
const galleryCollection = client.db("Laser_Dental").collection("gallery");
const appointmentsCollection = client.db("Laser_Dental").collection("appointments");
const servicesCollection = client.db("Laser_Dental").collection("services");
const reviewsCollection = client.db("Laser_Dental").collection("reviews");
const branchesCollection = client.db("Laser_Dental").collection("branches");
const doctorsCollection = client.db("Laser_Dental").collection("doctors");
const videosCollection = client.db("Laser_Dental").collection("videos");

// ── Test route ───────────────────────────────────────────────────────────
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

app.get("/banners/public", async (req, res) => {
  const result = await bannersCollection
    .find({ isActive: true })
    .sort({ createdAt: -1 })
    .toArray();
  res.send({ success: true, banners: result });
});

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

app.post("/gallery", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const data = req.body;

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

// ══════════════════════════════════════════════════════════════════
// APPOINTMENT ROUTES
// ══════════════════════════════════════════════════════════════════

app.post("/appointments", async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.phone || !data.service || !data.location || !data.date || !data.time) {
      return res.status(400).send({
        success: false,
        message: "Name, phone, service, location, date and time are required",
      });
    }

    const appointment = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      service: data.service,
      location: data.location,
      date: data.date,
      time: data.time,
      message: data.message?.trim() || "",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await appointmentsCollection.insertOne(appointment);

    res.send({
      success: true,
      message: "Appointment booked successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /appointments:", error);
    res.status(500).send({ success: false, message: "Failed to book appointment" });
  }
});

app.get("/appointments", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const { status, location, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (location) filter.location = location;
    if (date) filter.date = date;

    const result = await appointmentsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.send({ success: true, appointments: result, total: result.length });
  } catch (error) {
    console.error("GET /appointments:", error);
    res.status(500).send({ success: false, message: "Failed to fetch appointments" });
  }
});

app.get("/appointments/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;
    const item = await appointmentsCollection.findOne({ _id: new ObjectId(id) });
    if (!item) return res.status(404).send({ success: false, message: "Appointment not found" });
    res.send({ success: true, appointment: item });
  } catch (error) {
    console.error("GET /appointments/:id:", error);
    res.status(500).send({ success: false, message: "Failed to fetch appointment" });
  }
});

app.patch("/appointments/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    delete update._id;
    update.updatedAt = new Date();

    const result = await appointmentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ success: false, message: "Appointment not found" });
    }

    res.send({
      success: true,
      message: "Appointment updated",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PATCH /appointments/:id:", error);
    res.status(500).send({ success: false, message: "Failed to update appointment" });
  }
});

app.delete("/appointments/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;
    const result = await appointmentsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ success: false, message: "Appointment not found" });
    }

    res.send({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("DELETE /appointments/:id:", error);
    res.status(500).send({ success: false, message: "Failed to delete appointment" });
  }
});

// ══════════════════════════════════════════════════════════════════
// SERVICES ROUTES
// ══════════════════════════════════════════════════════════════════

app.get("/services", async (req, res) => {
  try {
    const result = await servicesCollection
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();
    res.send({ success: true, services: result });
  } catch (error) {
    console.error("GET /services:", error);
    res.status(500).send({ success: false, message: "Failed to fetch services" });
  }
});

app.get("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid service ID format",
      });
    }

    const query = { _id: new ObjectId(id) };
    const result = await servicesCollection.findOne(query);

    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Service not found",
      });
    }

    res.send({ success: true, service: result });
  } catch (error) {
    console.error("GET /services/:id:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch service details",
    });
  }
});

app.get("/admin/services", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const result = await servicesCollection
      .find()
      .sort({ order: 1 })
      .toArray();
    res.send({ success: true, services: result });
  } catch (error) {
    console.error("GET /admin/services:", error);
    res.status(500).send({ success: false, message: "Failed to fetch services" });
  }
});

app.patch("/services/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    delete update._id;
    delete update.iconKey;
    delete update.colorScheme;
    update.updatedAt = new Date();

    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ success: false, message: "Service not found" });
    }

    res.send({ success: true, message: "Service updated", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("PATCH /services/:id:", error);
    res.status(500).send({ success: false, message: "Failed to update service" });
  }
});

// ══════════════════════════════════════════════════════════════════
// REVIEW ROUTES
// ══════════════════════════════════════════════════════════════════

app.post("/reviews", async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.treatment || !data.rating || !data.review) {
      return res.status(400).send({
        success: false,
        message: "Name, treatment, rating and review are required",
      });
    }

    const initials = data.name
      .trim()
      .split(" ")
      .map((w) => w[0]?.toUpperCase())
      .slice(0, 2)
      .join("");

    const AVATAR_COLORS = [
      { bg: "#e0f2fe", color: "#0369a1" },
      { bg: "#dcfce7", color: "#166534" },
      { bg: "#fce7f3", color: "#9d174d" },
      { bg: "#d1fae5", color: "#065f46" },
      { bg: "#fef3c7", color: "#92400e" },
      { bg: "#ede9fe", color: "#5b21b6" },
    ];
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const review = {
      name: data.name.trim(),
      initials,
      treatment: data.treatment,
      rating: Number(data.rating),
      review: data.review.trim(),
      avatarBg: randomColor.bg,
      avatarColor: randomColor.color,
      status: "pending",
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await reviewsCollection.insertOne(review);
    res.send({ success: true, message: "Review submitted successfully" });
  } catch (error) {
    console.error("POST /reviews:", error);
    res.status(500).send({ success: false, message: "Failed to submit review" });
  }
});

app.get("/reviews/public", async (req, res) => {
  try {
    const result = await reviewsCollection
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .toArray();
    res.send({ success: true, reviews: result });
  } catch (error) {
    console.error("GET /reviews/public:", error);
    res.status(500).send({ success: false, message: "Failed to fetch reviews" });
  }
});

app.get("/reviews", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const result = await reviewsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.send({ success: true, reviews: result, total: result.length });
  } catch (error) {
    console.error("GET /reviews:", error);
    res.status(500).send({ success: false, message: "Failed to fetch reviews" });
  }
});

app.patch("/reviews/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    delete update._id;
    update.updatedAt = new Date();

    const result = await reviewsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ success: false, message: "Review not found" });
    }

    res.send({ success: true, message: "Review updated", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("PATCH /reviews/:id:", error);
    res.status(500).send({ success: false, message: "Failed to update review" });
  }
});

app.delete("/reviews/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;
    const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ success: false, message: "Review not found" });
    }

    res.send({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("DELETE /reviews/:id:", error);
    res.status(500).send({ success: false, message: "Failed to delete review" });
  }
});

// ══════════════════════════════════════════════════════════════════════
// BRANCH ROUTES
// ══════════════════════════════════════════════════════════════════════

app.get("/branches", async (req, res) => {
  try {
    const result = await branchesCollection
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();
    res.send({ success: true, branches: result });
  } catch (error) {
    console.error("GET /branches:", error);
    res.status(500).send({ success: false, message: "Failed to fetch branches" });
  }
});

app.get("/admin/branches", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const result = await branchesCollection
      .find()
      .sort({ order: 1 })
      .toArray();
    res.send({ success: true, branches: result, total: result.length });
  } catch (error) {
    console.error("GET /admin/branches:", error);
    res.status(500).send({ success: false, message: "Failed to fetch branches" });
  }
});

app.get("/branches/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ success: false, message: "Invalid branch ID format" });
    }

    const result = await branchesCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).send({ success: false, message: "Branch not found" });
    }

    res.send({ success: true, branch: result });
  } catch (error) {
    console.error("GET /branches/:id:", error);
    res.status(500).send({ success: false, message: "Failed to fetch branch" });
  }
});

app.post("/branches", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.slug || !data.area || !data.phone) {
      return res.status(400).send({
        success: false,
        message: "Name, slug, area and phone are required",
      });
    }

    const existing = await branchesCollection.findOne({ slug: data.slug });
    if (existing) {
      return res.status(409).send({
        success: false,
        message: "A branch with this slug already exists. Please choose a different one.",
      });
    }

    const lastBranch = await branchesCollection
      .find()
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    const nextOrder = lastBranch.length > 0 ? (lastBranch[0].order || 0) + 1 : 1;

    const branch = {
      name: data.name.trim(),
      slug: data.slug.trim().toLowerCase(),
      area: data.area.trim(),
      city: data.city?.trim() || "Dhaka",
      address: data.address?.trim() || "",
      phone: data.phone.trim(),
      whatsapp: data.whatsapp?.trim() || data.phone.replace(/^0/, "880").trim(),
      mapLink: data.mapLink?.trim() || "",
      mapEmbedSrc: data.mapEmbedSrc?.trim() || "",
      landmark: data.landmark?.trim() || "",
      colorScheme: data.colorScheme || "sky",
      hours: Array.isArray(data.hours) ? data.hours : [],
      closedDays: Array.isArray(data.closedDays) ? data.closedDays : ["Friday"],
      transport: Array.isArray(data.transport) ? data.transport : [],
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await branchesCollection.insertOne(branch);

    res.send({
      success: true,
      message: "Branch added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /branches:", error);
    res.status(500).send({ success: false, message: "Failed to add branch" });
  }
});

app.patch("/branches/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ success: false, message: "Invalid branch ID format" });
    }

    delete update._id;

    if (update.slug) {
      update.slug = update.slug.trim().toLowerCase();
      const existing = await branchesCollection.findOne({
        slug: update.slug,
        _id: { $ne: new ObjectId(id) },
      });
      if (existing) {
        return res.status(409).send({
          success: false,
          message: "Another branch already uses this slug",
        });
      }
    }

    update.updatedAt = new Date();

    const result = await branchesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ success: false, message: "Branch not found" });
    }

    res.send({
      success: true,
      message: "Branch updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PATCH /branches/:id:", error);
    res.status(500).send({ success: false, message: "Failed to update branch" });
  }
});

app.patch("/branches/reorder", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).send({ success: false, message: "orders array is required" });
    }

    const bulkOps = orders.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order, updatedAt: new Date() } },
      },
    }));

    await branchesCollection.bulkWrite(bulkOps);

    res.send({ success: true, message: "Branch order updated" });
  } catch (error) {
    console.error("PATCH /branches/reorder:", error);
    res.status(500).send({ success: false, message: "Failed to reorder branches" });
  }
});

app.delete("/branches/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ success: false, message: "Invalid branch ID format" });
    }

    const totalBranches = await branchesCollection.countDocuments();
    if (totalBranches <= 1) {
      return res.status(400).send({
        success: false,
        message: "Cannot delete the only remaining branch. Add another branch first.",
      });
    }

    const result = await branchesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ success: false, message: "Branch not found" });
    }

    res.send({ success: true, message: "Branch deleted successfully" });
  } catch (error) {
    console.error("DELETE /branches/:id:", error);
    res.status(500).send({ success: false, message: "Failed to delete branch" });
  }
});

// ══════════════════════════════════════════════════════════════════════
// DOCTOR ROUTES
// ══════════════════════════════════════════════════════════════════════

const sanitizeDegrees = (degrees) => {
  if (!Array.isArray(degrees)) return [];
  return degrees
    .map((d) => {
      if (typeof d === "string") {
        return d.trim() ? { title: d.trim(), certificateImage: "" } : null;
      }
      if (d && typeof d === "object" && d.title?.trim()) {
        return {
          title: d.title.trim(),
          certificateImage: d.certificateImage?.trim() || "",
        };
      }
      return null;
    })
    .filter(Boolean);
};

app.get("/doctors", async (req, res) => {
  try {
    const result = await doctorsCollection
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();
    res.send({ success: true, doctors: result });
  } catch (error) {
    console.error("GET /doctors:", error);
    res.status(500).send({ success: false, message: "Failed to fetch doctors" });
  }
});

app.get("/doctors/featured", async (req, res) => {
  try {
    const result = await doctorsCollection
      .find({ isActive: true, isFeatured: true })
      .sort({ order: 1 })
      .toArray();
    res.send({ success: true, doctors: result });
  } catch (error) {
    console.error("GET /doctors/featured:", error);
    res.status(500).send({ success: false, message: "Failed to fetch featured doctors" });
  }
});

app.get("/doctors/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await doctorsCollection.findOne({ slug, isActive: true });

    if (!result) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }

    res.send({ success: true, doctor: result });
  } catch (error) {
    console.error("GET /doctors/slug/:slug:", error);
    res.status(500).send({ success: false, message: "Failed to fetch doctor" });
  }
});

app.get("/admin/doctors", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const result = await doctorsCollection
      .find()
      .sort({ order: 1 })
      .toArray();
    res.send({ success: true, doctors: result, total: result.length });
  } catch (error) {
    console.error("GET /admin/doctors:", error);
    res.status(500).send({ success: false, message: "Failed to fetch doctors" });
  }
});

app.get("/doctors/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ success: false, message: "Invalid doctor ID format" });
    }

    const result = await doctorsCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }

    res.send({ success: true, doctor: result });
  } catch (error) {
    console.error("GET /doctors/:id:", error);
    res.status(500).send({ success: false, message: "Failed to fetch doctor" });
  }
});

app.post("/doctors", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.slug || !data.title) {
      return res.status(400).send({
        success: false,
        message: "Name, slug and title are required",
      });
    }

    const existing = await doctorsCollection.findOne({ slug: data.slug });
    if (existing) {
      return res.status(409).send({
        success: false,
        message: "A doctor with this slug already exists. Please choose a different one.",
      });
    }

    const lastDoctor = await doctorsCollection
      .find()
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    const nextOrder = lastDoctor.length > 0 ? (lastDoctor[0].order || 0) + 1 : 1;

    const doctor = {
      name: data.name.trim(),
      slug: data.slug.trim().toLowerCase(),
      title: data.title.trim(),
      degrees: sanitizeDegrees(data.degrees),
      photo: data.photo?.trim() || "",
      specializations: Array.isArray(data.specializations) ? data.specializations : [],
      bio: data.bio?.trim() || "",
      quote: data.quote?.trim() || "",
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
      branchSlugs: Array.isArray(data.branchSlugs) ? data.branchSlugs : [],
      yearsExperience: data.yearsExperience !== undefined ? Number(data.yearsExperience) : 0,
      patientsCount: data.patientsCount !== undefined ? Number(data.patientsCount) : 0,
      isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
      isActive: data.isActive !== undefined ? data.isActive : true,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await doctorsCollection.insertOne(doctor);

    res.send({
      success: true,
      message: "Doctor added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /doctors:", error);
    res.status(500).send({ success: false, message: "Failed to add doctor" });
  }
});

app.patch("/doctors/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ success: false, message: "Invalid doctor ID format" });
    }

    delete update._id;

    if (update.degrees !== undefined) {
      update.degrees = sanitizeDegrees(update.degrees);
    }

    if (update.slug) {
      update.slug = update.slug.trim().toLowerCase();
      const existing = await doctorsCollection.findOne({
        slug: update.slug,
        _id: { $ne: new ObjectId(id) },
      });
      if (existing) {
        return res.status(409).send({
          success: false,
          message: "Another doctor already uses this slug",
        });
      }
    }

    update.updatedAt = new Date();

    const result = await doctorsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }

    res.send({
      success: true,
      message: "Doctor updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PATCH /doctors/:id:", error);
    res.status(500).send({ success: false, message: "Failed to update doctor" });
  }
});

app.patch("/doctors/reorder", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).send({ success: false, message: "orders array is required" });
    }

    const bulkOps = orders.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order, updatedAt: new Date() } },
      },
    }));

    await doctorsCollection.bulkWrite(bulkOps);

    res.send({ success: true, message: "Doctor order updated" });
  } catch (error) {
    console.error("PATCH /doctors/reorder:", error);
    res.status(500).send({ success: false, message: "Failed to reorder doctors" });
  }
});

app.delete("/doctors/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ success: false, message: "Invalid doctor ID format" });
    }

    const result = await doctorsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }

    res.send({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("DELETE /doctors/:id:", error);
    res.status(500).send({ success: false, message: "Failed to delete doctor" });
  }
});

// ══════════════════════════════════════════════════════════════════════
// VIDEO ROUTES
// ══════════════════════════════════════════════════════════════════════

app.get("/videos/active", async (req, res) => {
  try {
    const result = await videosCollection.findOne({ isActive: true });
    res.send({ success: true, video: result || null });
  } catch (error) {
    console.error("GET /videos/active:", error);
    res.status(500).send({ success: false, message: "Failed to fetch active video" });
  }
});

app.get("/admin/videos", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const result = await videosCollection
      .find()
      .sort({ order: 1 })
      .toArray();
    res.send({ success: true, videos: result, total: result.length });
  } catch (error) {
    console.error("GET /admin/videos:", error);
    res.status(500).send({ success: false, message: "Failed to fetch videos" });
  }
});

app.get("/videos/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ success: false, message: "Invalid video ID format" });
    }

    const result = await videosCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).send({ success: false, message: "Video not found" });
    }

    res.send({ success: true, video: result });
  } catch (error) {
    console.error("GET /videos/:id:", error);
    res.status(500).send({ success: false, message: "Failed to fetch video" });
  }
});

app.post("/videos", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const data = req.body;

    if (!data.videoUrl) {
      return res.status(400).send({
        success: false,
        message: "videoUrl is required",
      });
    }

    const lastVideo = await videosCollection
      .find()
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    const nextOrder = lastVideo.length > 0 ? (lastVideo[0].order || 0) + 1 : 1;

    if (data.isActive) {
      await videosCollection.updateMany({}, { $set: { isActive: false } });
    }

    const video = {
      title: data.title?.trim() || "",
      videoUrl: data.videoUrl.trim(),
      thumbnailUrl: data.thumbnailUrl?.trim() || "",
      cloudinaryPublicId: data.cloudinaryPublicId?.trim() || "",
      autoplay: data.autoplay !== undefined ? data.autoplay : true,
      muted: data.muted !== undefined ? data.muted : true,
      loop: data.loop !== undefined ? data.loop : true,
      isActive: data.isActive !== undefined ? data.isActive : false,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await videosCollection.insertOne(video);

    res.send({
      success: true,
      message: "Video added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /videos:", error);
    res.status(500).send({ success: false, message: "Failed to add video" });
  }
});

app.patch("/videos/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ success: false, message: "Invalid video ID format" });
    }

    delete update._id;

    if (update.isActive === true) {
      await videosCollection.updateMany(
        { _id: { $ne: new ObjectId(id) } },
        { $set: { isActive: false } }
      );
    }

    update.updatedAt = new Date();

    const result = await videosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ success: false, message: "Video not found" });
    }

    res.send({
      success: true,
      message: "Video updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PATCH /videos/:id:", error);
    res.status(500).send({ success: false, message: "Failed to update video" });
  }
});

app.delete("/videos/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ success: false, message: "Invalid video ID format" });
    }

    const result = await videosCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ success: false, message: "Video not found" });
    }

    res.send({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    console.error("DELETE /videos/:id:", error);
    res.status(500).send({ success: false, message: "Failed to delete video" });
  }
});

// ── Root ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Laser Dental Point API ✅");
});

// ── Vercel serverless export ────────────────────────────────────────────────
// Vercel e app.listen() kaj kore na — tar bodole Express app ke directly
// export kore dite hoy. Vercel nijei request handle kore "serverless function"
// hisebe.
//
// Local e (tomar nijer PC te) test korar jonno app.listen() o rakhlam, kintu
// shudhu tokhon e run hobe jokhon tumi local e "node index.js" diye direct
// run korbe. Vercel e deploy hole eta run hobe na (Vercel nijer system use kore).
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

module.exports = app;