const admin = require ('firebase-admin');

// Ganti dengan konfigurasi firebase admin SDK Anda
const serviceAccount = require("./serviceaccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'parentpal-407307.firebaseapp.com', // Ganti dengan URL Firestore Anda
});

const db = admin.firestore();

module.exports = db;