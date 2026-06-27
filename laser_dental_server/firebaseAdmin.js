const admin = require("firebase-admin");

// 🔥 Vercel e JSON file thakbe na (gitignore + Vercel filesystem e write kora jay na
// safely), tai service account ke ekta single-line env variable theke porbo.
// Local e (.env file thakle) o eta kaj korbe, jodi .env e ei variable thake.
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Vercel / production: env var e pura JSON string (stringified) thakbe
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local development fallback: purono poddhoti, serviceAccountKey.json file
  // (local e file ta thakle e use hobe, kintu Vercel e ei file thakbe na)
  serviceAccount = require("./serviceAccountKey.json");
}

// 🔥 initialize (Vercel serverless e baar baar function call hoy, tai
// already initialize thakle abar initializeApp na kora — error theke bachay)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;