const Users = require ("../models/UserModel.js");
const bcrypt = require ("bcrypt");
const jwt = require ("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const usersSnapshot = await Users.get();
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  const userSnapshot = await Users.where('email', '==', email).get();
    if (!userSnapshot.empty) return res.status(404).json({ msg: "Email sudah terdaftar" });

  if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });

  try {
    await Users.add({
      name: name,
      email: email,
      password: password, // Tambahkan kebutuhan lain sesuai kebutuhan Firestore Anda
      access_token: "",
      refresh_token: ""
    });

    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
  try {
    const userSnapshot = await Users.where('email', '==', req.body.email).get();
    if (userSnapshot.empty) return res.status(404).json({ msg: "Email tidak ditemukan" });

    const user = userSnapshot.docs[0].data();
    const documentId = userSnapshot.docs[0].id;
    if (user.password !== req.body.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    // const match = await bcrypt.compare(req.body.password, user.password);
    // if (!match) return res.status(400).json({ msg: "Wrong Password" });

    const userId = documentId;
    const name = user.name;
    const email = user.email;
    // console.log(userId);
    // console.log(process.env.ACCESS_TOKEN_SECRET);
    // console.log(email);
    const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20s'
    });

    const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    });

    await Users.doc(userId).update({ refresh_token: refreshToken });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(204);

  try {
    const userSnapshot = await Users.where('refresh_token', '==', refreshToken).get();
    const users = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(users);
    if (userSnapshot.empty) return res.sendStatus(204);

    const userId = userSnapshot.docs[0].id;

    await Users.doc(userId).update({ refresh_token: null });

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { getUsers, Register, Login, Logout };