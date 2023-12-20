const express = require ("express");
const dotenv = require ("dotenv");
const cookieParser = require ("cookie-parser");
const cors = require ("cors");
const router = require ("./routes/index.js");
dotenv.config();
const app = express();

// try {
//     await db.authenticate();
//     console.log('Database Connected...');
// } catch (error) {
//     console.error(error);
// }

app.use(cors({ credentials:true, origin:'http://localhost:8000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})