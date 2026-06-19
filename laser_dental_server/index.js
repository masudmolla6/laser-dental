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
    const appointmentsCollection = client.db("Laser_Dental").collection("appointments");
    const servicesCollection = client.db("Laser_Dental").collection("services");
    const reviewsCollection = client.db("Laser_Dental").collection("reviews");
    const branchesCollection = client.db("Laser_Dental").collection("branches");
    const doctorsCollection = client.db("Laser_Dental").collection("doctors");

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

    // Public — website এর জন্য (active banners only)
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



    // ══════════════════════════════════════════════════════════════════
    // APPOINTMENT ROUTES
    // ══════════════════════════════════════════════════════════════════

    // POST — public (anyone can book without account)
    app.post("/appointments", async (req, res) => {
      try {
        const data = req.body;

        // console.log(data);

        // Validation
        if (!data.name || !data.phone || !data.service || !data.location || !data.date || !data.time) {
          return res.status(400).send({
            success: false,
            message: "Name, phone, service, location, date and time are required",
          });
        }

        const appointment = {
          name:      data.name.trim(),
          phone:     data.phone.trim(),
          service:   data.service,
          location:  data.location,   // "branch1" | "branch2"
          date:      data.date,       // "YYYY-MM-DD"
          time:      data.time,       // "10:00 AM"
          message:   data.message?.trim() || "",
          status:    "pending",       // pending | confirmed | completed | cancelled
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

    // GET all — admin only
    app.get("/appointments", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const { status, location, date } = req.query;
        const filter = {};
        if (status)   filter.status   = status;
        if (location) filter.location = location;
        if (date)     filter.date     = date;

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

    // GET single by ID — admin only
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

    // PATCH — update status or details — admin only
    app.patch("/appointments/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id     = req.params.id;
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

    // DELETE — admin only
    app.delete("/appointments/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id     = req.params.id;
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
    
    // Initial seed data — run once to populate DB
    // POST /services/seed  (admin only — run once then delete/comment out)
    // app.post("/services/seed", verifyToken, verifyAdmin(userCollection), async (req, res) => {
    //   try {
    //     const existing = await servicesCollection.countDocuments();
    //     if (existing > 0) {
    //       return res.send({ success: false, message: "Already seeded" });
    //     }
    
    //     const services = [
    //       {
    //         iconKey: "zap",
    //         category: "Cosmetic",
    //         title: "Laser Teeth Whitening",
    //         shortDesc: "Brighten your smile up to 8 shades in a single session.",
    //         description: "Our advanced laser whitening system uses medical-grade technology to safely remove deep stains caused by coffee, tea, and aging. The procedure is painless, fast, and delivers immediate, dramatic results.",
    //         duration: "60 min",
    //         price: "৳ 4,500",
    //         tag: "Most Popular",
    //         colorScheme: "sky",
    //         isActive: true,
    //         order: 1,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //       {
    //         iconKey: "anchor",
    //         category: "Restorative",
    //         title: "Dental Implants",
    //         shortDesc: "Permanent tooth replacement that looks and feels natural.",
    //         description: "Titanium implants fused with your jawbone give you a lifetime solution for missing teeth. We use digital imaging for precise placement and craft each crown to match your natural teeth perfectly.",
    //         duration: "2–3 sessions",
    //         price: "৳ 35,000",
    //         tag: "Premium",
    //         colorScheme: "emerald",
    //         isActive: true,
    //         order: 2,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //       {
    //         iconKey: "alignCenter",
    //         category: "Orthodontics",
    //         title: "Braces & Aligners",
    //         shortDesc: "Straighten your teeth with modern, comfortable solutions.",
    //         description: "From traditional metal braces to virtually invisible clear aligners, we offer personalized orthodontic treatment plans for teens and adults. Our orthodontists use 3D digital scans for precise treatment planning.",
    //         duration: "12–24 months",
    //         price: "From ৳ 18,000",
    //         tag: "Customized",
    //         colorScheme: "violet",
    //         isActive: true,
    //         order: 3,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //       {
    //         iconKey: "sparkles",
    //         category: "Preventive",
    //         title: "Scaling & Polishing",
    //         shortDesc: "Professional cleaning for healthier gums and fresher breath.",
    //         description: "Our ultrasonic scaling removes tartar buildup above and below the gumline, followed by a professional polishing that removes surface stains. Recommended every 6 months to prevent gum disease.",
    //         duration: "45 min",
    //         price: "৳ 1,800",
    //         tag: "Routine Care",
    //         colorScheme: "orange",
    //         isActive: true,
    //         order: 4,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //       {
    //         iconKey: "heartPulse",
    //         category: "Restorative",
    //         title: "Root Canal Treatment",
    //         shortDesc: "Save your natural tooth from infection, painlessly.",
    //         description: "Modern root canal therapy is virtually painless. We remove infected pulp, sterilize the canal with laser technology, and seal it with a biocompatible material — often completed in a single visit.",
    //         duration: "60–90 min",
    //         price: "৳ 8,000",
    //         tag: "Laser Assisted",
    //         colorScheme: "red",
    //         isActive: true,
    //         order: 5,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //       {
    //         iconKey: "smile",
    //         category: "Cosmetic",
    //         title: "Smile Makeover",
    //         shortDesc: "A complete transformation tailored to your face and goals.",
    //         description: "Combining veneers, whitening, contouring, and bonding, our smile makeover is a fully personalized cosmetic plan. We use digital smile design to show you your results before a single procedure begins.",
    //         duration: "3–5 sessions",
    //         price: "From ৳ 55,000",
    //         tag: "Signature",
    //         colorScheme: "amber",
    //         isActive: true,
    //         order: 6,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //     ];
    
    //     await servicesCollection.insertMany(services);
    //     res.send({ success: true, message: "Services seeded successfully", count: services.length });
    //   } catch (error) {
    //     console.error("POST /services/seed:", error);
    //     res.status(500).send({ success: false, message: "Seed failed" });
    //   }
    // });
    
    // GET all — public (Home page এর জন্য, শুধু active)
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

    // GET single service by ID — public (Service Details পেজের জন্য)
    app.get("/services/:id", async (req, res) => {
      try {
        const { id } = req.params;
        
        // Check if valid ObjectId
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ 
            success: false, 
            message: "Invalid service ID format" 
          });
        }

        const query = { _id: new ObjectId(id) };
        const result = await servicesCollection.findOne(query);

        if (!result) {
          return res.status(404).send({ 
            success: false, 
            message: "Service not found" 
          });
        }

        res.send({ success: true, service: result });
      } catch (error) {
        console.error("GET /services/:id:", error);
        res.status(500).send({ 
          success: false, 
          message: "Failed to fetch service details" 
        });
      }
    });
    
    // GET all for admin — includes inactive
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
    
    // PATCH — update editable fields (admin only)
    app.patch("/services/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id     = req.params.id;
        const update = req.body;
        delete update._id;
        delete update.iconKey;      // icon change করা যাবে না
        delete update.colorScheme;  // color change করা যাবে না
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

    // Collection: reviewsCollection
    // const reviewsCollection = client.db("Laser_Dental").collection("reviews");

    // POST — public (anyone can submit)
    app.post("/reviews", async (req, res) => {
      try {
        const data = req.body;

        if (!data.name || !data.treatment || !data.rating || !data.review) {
          return res.status(400).send({
            success: false,
            message: "Name, treatment, rating and review are required",
          });
        }

        // Auto-generate initials from name
        const initials = data.name
          .trim()
          .split(" ")
          .map((w) => w[0]?.toUpperCase())
          .slice(0, 2)
          .join("");

        // Avatar color pairs
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
          name:       data.name.trim(),
          initials,
          treatment:  data.treatment,
          rating:     Number(data.rating),
          review:     data.review.trim(),
          avatarBg:   randomColor.bg,
          avatarColor:randomColor.color,
          status:     "pending",   // pending | approved | rejected
          date:       new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          createdAt:  new Date(),
          updatedAt:  new Date(),
        };

        await reviewsCollection.insertOne(review);
        res.send({ success: true, message: "Review submitted successfully" });
      } catch (error) {
        console.error("POST /reviews:", error);
        res.status(500).send({ success: false, message: "Failed to submit review" });
      }
    });

    // GET — public (only approved)
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

    // GET all — admin (all statuses)
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

    // PATCH — approve / reject / update (admin)
    app.patch("/reviews/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id     = req.params.id;
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

    // DELETE — admin
    app.delete("/reviews/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id     = req.params.id;
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
    // BRANCH ROUTES (v2 — expanded schema) — add this block inside run() in
    // your index.js, near the other route sections (e.g. after SERVICES ROUTES).
    //
    // Also add this line near your other collections:
    //   const branchesCollection = client.db("Laser_Dental").collection("branches");
    //
    // ══════════════════════════════════════════════════════════════════════
    //
    // EXPANDED SCHEMA — fields now stored per branch:
    // {
    //   name, slug, area, city, address, phone, whatsapp,
    //   mapLink,        // Google Maps share/search link — used for "Get Directions"
    //   mapEmbedSrc,    // Google Maps EMBED iframe src (optional — falls back to placeholder if empty)
    //   landmark,       // e.g. "Near City Hospital"
    //   colorScheme,    // "sky" | "violet" | "emerald" | "amber" | "rose" | "cyan"
    //   hours: [{ label, morning, evening }],   // label e.g. "Saturday – Thursday"
    //   closedDays: ["Friday"],
    //   transport: ["Bus stop nearby", ...],
    //   amenities: ["Free parking", ...],
    //   isActive, order, createdAt, updatedAt
    // }

    // GET all — public (Appointment form & Locations page, শুধু active branches)
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

    // GET all for admin — includes inactive branches
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

    // GET single by ID — admin only (for edit form pre-fill)
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

    // POST — add new branch — admin only
    app.post("/branches", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const data = req.body;

        // Validation — core required fields
        if (!data.name || !data.slug || !data.area || !data.phone) {
          return res.status(400).send({
            success: false,
            message: "Name, slug, area and phone are required",
          });
        }

        // Slug must be unique — appointment form uses it as the location value
        const existing = await branchesCollection.findOne({ slug: data.slug });
        if (existing) {
          return res.status(409).send({
            success: false,
            message: "A branch with this slug already exists. Please choose a different one.",
          });
        }

        // Determine next order value (new branch goes to the end)
        const lastBranch = await branchesCollection
          .find()
          .sort({ order: -1 })
          .limit(1)
          .toArray();
        const nextOrder = lastBranch.length > 0 ? (lastBranch[0].order || 0) + 1 : 1;

        const branch = {
          name:         data.name.trim(),
          slug:         data.slug.trim().toLowerCase(),
          area:         data.area.trim(),
          city:         data.city?.trim() || "Dhaka",
          address:      data.address?.trim() || "",
          phone:        data.phone.trim(),
          whatsapp:     data.whatsapp?.trim() || data.phone.replace(/^0/, "880").trim(),
          mapLink:      data.mapLink?.trim() || "",
          mapEmbedSrc:  data.mapEmbedSrc?.trim() || "",
          landmark:     data.landmark?.trim() || "",
          colorScheme:  data.colorScheme || "sky",
          hours:        Array.isArray(data.hours) ? data.hours : [],
          closedDays:   Array.isArray(data.closedDays) ? data.closedDays : ["Friday"],
          transport:    Array.isArray(data.transport) ? data.transport : [],
          amenities:    Array.isArray(data.amenities) ? data.amenities : [],
          isActive:     data.isActive !== undefined ? data.isActive : true,
          order:        nextOrder,
          createdAt:    new Date(),
          updatedAt:    new Date(),
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

    // PATCH — update branch (any field, including isActive toggle) — admin only
    app.patch("/branches/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id     = req.params.id;
        const update = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ success: false, message: "Invalid branch ID format" });
        }

        delete update._id;

        // If slug is being changed, make sure it's still unique
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

    // PATCH — reorder branches — admin only
    // body: { orders: [{ id: "...", order: 1 }, { id: "...", order: 2 }] }
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

    // DELETE — admin only
    // Note: appointments already booked under this branch keep their old `location`
    // value (the slug), so historical records remain intact even after deletion.
    app.delete("/branches/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ success: false, message: "Invalid branch ID format" });
        }

        // Prevent deleting the last remaining branch — site must always have one
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
    // DOCTOR ROUTES — add this block inside run() in your index.js,
    // near the other route sections (e.g. after BRANCH ROUTES).
    //
    // Also add this line near your other collections:
    //   const doctorsCollection = client.db("Laser_Dental").collection("doctors");
    //
    // ══════════════════════════════════════════════════════════════════════
    //
    // SCHEMA — fields stored per doctor:
    // {
    //   name, slug, title,
    //   degrees: [{ title, certificateImage }],   // certificateImage is optional — URL to scanned certificate photo
    //   photo,
    //   specializations: [{ iconKey, label, color, bg }],
    //   bio, quote,
    //   achievements: [{ iconKey, text }],
    //   branchSlugs: ["mirpur", "uttara"],   // multi-select — which branches this doctor sits at
    //   yearsExperience, patientsCount,
    //   isFeatured,    // shown in the Home page doctor section
    //   isActive,
    //   order,
    //   createdAt, updatedAt
    // }

    // Normalizes the `degrees` field — accepts either the old plain-string
    // format (backward compatibility for data added before certificate
    // images existed) or the new { title, certificateImage } object format.
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

    // GET all — public (Doctors listing page, শুধু active doctors)
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

    // GET featured doctor(s) — public (Home page section এর জন্য)
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

    // GET single by slug — public (Doctor details page এর জন্য, e.g. /doctors/dr-fatema-khanam)
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

    // GET all for admin — includes inactive doctors
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

    // GET single by ID — admin only (for edit form pre-fill)
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

    // POST — add new doctor — admin only
    app.post("/doctors", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const data = req.body;

        // Validation — core required fields
        if (!data.name || !data.slug || !data.title) {
          return res.status(400).send({
            success: false,
            message: "Name, slug and title are required",
          });
        }

        // Slug must be unique — used in the doctor profile URL (/doctors/:slug)
        const existing = await doctorsCollection.findOne({ slug: data.slug });
        if (existing) {
          return res.status(409).send({
            success: false,
            message: "A doctor with this slug already exists. Please choose a different one.",
          });
        }

        // Determine next order value (new doctor goes to the end)
        const lastDoctor = await doctorsCollection
          .find()
          .sort({ order: -1 })
          .limit(1)
          .toArray();
        const nextOrder = lastDoctor.length > 0 ? (lastDoctor[0].order || 0) + 1 : 1;

        const doctor = {
          name:            data.name.trim(),
          slug:            data.slug.trim().toLowerCase(),
          title:           data.title.trim(),
          degrees:         sanitizeDegrees(data.degrees),
          photo:           data.photo?.trim() || "",
          specializations: Array.isArray(data.specializations) ? data.specializations : [],
          bio:             data.bio?.trim() || "",
          quote:           data.quote?.trim() || "",
          achievements:    Array.isArray(data.achievements) ? data.achievements : [],
          branchSlugs:     Array.isArray(data.branchSlugs) ? data.branchSlugs : [],
          yearsExperience: data.yearsExperience !== undefined ? Number(data.yearsExperience) : 0,
          patientsCount:   data.patientsCount !== undefined ? Number(data.patientsCount) : 0,
          isFeatured:      data.isFeatured !== undefined ? data.isFeatured : false,
          isActive:        data.isActive !== undefined ? data.isActive : true,
          order:           nextOrder,
          createdAt:       new Date(),
          updatedAt:       new Date(),
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

    // PATCH — update doctor (any field, including isActive/isFeatured toggle) — admin only
    app.patch("/doctors/:id", verifyToken, verifyAdmin(userCollection), async (req, res) => {
      try {
        const id     = req.params.id;
        const update = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ success: false, message: "Invalid doctor ID format" });
        }

        delete update._id;

        // Normalize degrees if it's part of this update (same as POST)
        if (update.degrees !== undefined) {
          update.degrees = sanitizeDegrees(update.degrees);
        }

        // If slug is being changed, make sure it's still unique
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

    // PATCH — reorder doctors — admin only
    // body: { orders: [{ id: "...", order: 1 }, { id: "...", order: 2 }] }
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

    // DELETE — admin only
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
