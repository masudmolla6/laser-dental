const admin = require("../firebaseAdmin");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("No token");
  }

  const token = authHeader.split(" ")[1];  

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded; // 🔥 user info
    console.log("from VerifyToken" , req.user?.email);
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

module.exports = verifyToken;