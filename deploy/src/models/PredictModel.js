const db = require ("../config/Firestore.js");

const Predictions = db.collection('Predictions');

module.exports = Predictions;