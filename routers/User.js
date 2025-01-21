const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../modules/User");
const Movie = require("../modules/Movie"); // Card modelini import qilish
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/token");
const bcrypt = require("bcrypt");

// get user
router.get("/me", auth, (req, res, next) => {
  const user = req.user;
  res.json({
    message: user,
  });
});


// register user
router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  const user = await User.findOne({ username: username });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  if (user) return res.status(400).json({ message: "Bunday foydalanuvchi mavjud" });

  const newUser = new User({
    name,
    username,
    email,
    password: passwordHash,
  });

  newUser
    .save()
    .then((user) =>
      res.json({
        message: user,
      })
    )
    .catch((error) =>
      res.status(400).json({
        message: error,
      })
    );
});

// login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!password) return res.status(400).json({ message: "Ma'lumot to'liq emas" });

  const user = await User.findOne({ username: username });
  if (!user) return res.status(400).json({ message: "Username yoki parol xato" });

  const comparePass = await bcrypt.compare(password, user.password);
  if (!comparePass) return res.status(400).json({ message: "Parol yoki username xato" });

  const token = jwt.sign({ user: user._id }, config.get("tokenPrivateKey"));
  res.json({ message: "Token yaratildi", token });
});

// update user
router.post("/edit", auth, async (req, res) => {
  const { name, username, email, password } = req.body;
  const authUser = await User.findOne({ username: req.user.username });
  if (!authUser) return res.status(404).send("User not found");
  try {
    authUser.name = name;
    authUser.email = email;
    authUser.username = username;
    authUser.password = password;
    await authUser.save();
    res.json({
      message: "User updated successfully",
      authUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;