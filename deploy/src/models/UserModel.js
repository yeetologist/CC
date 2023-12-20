const db = require ("../config/Firestore.js");

const Users = db.collection('Users');

module.exports = Users;