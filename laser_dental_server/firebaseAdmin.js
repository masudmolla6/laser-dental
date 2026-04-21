const admin = require("firebase-admin");

// 🔥 JSON file import
const serviceAccount = require("./serviceAccountKey.json");

// 🔥 initialize
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;