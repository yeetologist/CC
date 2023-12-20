const Users = require ("../models/UserModel.js");
const jwt = require ("jsonwebtoken");

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const userSnapshot = await Users.where('refresh_token', '==', refreshToken).get();

    if (userSnapshot.empty) return res.sendStatus(403);

    const user = userSnapshot.docs[0].data();
    const documentId = userSnapshot.docs[0].id;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403);

      const userId = documentId;
      const name = user.name;
      const email = user.email;

      const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15h'
      });

      // Get various components of the date and time
        // const year = currentDate.getFullYear();
        // const month = currentDate.getMonth() + 1; // Note: Months are zero-based, so we add 1
        // const day = currentDate.getDate();
        // const hours = currentDate.getHours();
        // const minutes = currentDate.getMinutes();
        // const seconds = currentDate.getSeconds();

      // Format the date and time as needed
        // const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
        // await Users.doc(userId).update({ updatedAt: formattedDateTime });
        await Users.doc(userId).update({ access_token: accessToken });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

module.exports = refreshToken;