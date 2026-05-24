const { ObjectId } = require("mongodb");

const verifyAdmin = (userCollection) => {
  return async (req, res, next) => {
    try {
      const email = req.user?.email; // 🔥 verifyToken theke ashbe

      console.log(email);

      if (!email) {
        return res.status(401).send({ message: "Unauthorized access" });
      }

      // 🔥 DB theke user khuje ber koro
      const user = await userCollection.findOne({ email });

      if (!user) {
        return res.status(401).send({ message: "User not found" });
      }

      // 🔥 role check
      if (user.role !== "admin") {
        return res.status(403).send({ message: "Forbidden: Admin only" });
      }

      // ✅ allow access
      next();

    } catch (error) {
      console.error("verifyAdmin error:", error);
      res.status(500).send({ message: "Server error" });
    }
  };
};

module.exports = verifyAdmin;