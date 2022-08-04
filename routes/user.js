const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  console.log("route signup");
  const { username, email, password } = req.body;
  try {
    if (username && email && password) {
      const doesEmailExist = await User.findOne({ email: email });

      if (doesEmailExist) {
        res.status(409).json({ message: "Email does already exist" });
      } else {
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);
        // const token = uid2(16);

        const newUser = new User({
          username: username,
          email: email,
          // token: token,
          salt: salt,
          hash: hash,
        });
        await newUser.save();

        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          // token: newUser.token,
        });
      }
    } else {
      res.status(406).json({ message: "Missing information(s)" });
    }
    // res.json("coucou");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne(email);
    const newHash = SHA256(password + user.salt).toString(encBase64);
    if (user.hash === newHash) {
      res.json({
        id: user.id,
        // token: user.token,
        // accout: {
        //   username: user.account.username,
        // },
      });
    } else {
      res.status(400).json("noooop");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
