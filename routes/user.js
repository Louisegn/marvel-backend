const express = require("express");
const router = express.Router();
const cors = require("cors");
const axios = require("axios");

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user", async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "ehhh nooooop" });
  }
});

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
        const token = uid2(16);

        const newUser = new User({
          username: username,
          email: email,
          token: token,
          salt: salt,
          hash: hash,
        });
        await newUser.save();

        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          token: newUser.token,
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

    console.log(email, password);
    const user = await User.findOne({ email: email });
    console.log(user);
    console.log(password);
    const newHash = SHA256(password + user.salt).toString(encBase64);
    console.log(newHash);
    if (user.hash === newHash) {
      console.log("coucou");
      res.json(
        user
        // {
        // id: user.id,
        // token: user.token,
        // accout: {
        //   username: user.account.username,
        // },
        // }
      );
    } else {
      res.status(400).json("noooop");
    }
  } catch (error) {
    // res.status(400).json({ message: error.message });
    res.status(400).json({ message: "ehhh nooooop" });
  }
});

router.post("/user/favorites", async (req, res) => {
  try {
    const { userId, comicId, charaId } = req.body;

    // console.log(comicId);
    const user = await User.findOne({ _id: userId });
    // console.log(user);
    if (comicId) {
      let x = -1;
      let i = 0;
      for (i; i < user.favoritesComics.length; i++) {
        if (user.favoritesComics[i]._id === comicId._id) {
          x = i;
          break;
        }
      }

      console.log(i);
      // const i = user.favoritesComics.indexOf(comicId);
      if (x === -1) {
        user.favoritesComics.push(comicId);
      } else {
        user.favoritesComics.splice(i, 1);
      }
      await user.save();
      res.json(user);
    } else if (charaId) {
      // let i = 0;
      // for (i; i < user.favoritesChara.length; i++) {
      //   if (user.favoritesChara._id === charaId) {
      //     break;
      //   }
      // }
      // console.log(i);
      // if (i === 0) {
      //   const response = await axios.get(
      //     `https://lereacteur-marvel-api.herokuapp.com/character/${charaId}?apiKey=${process.env.API_KEY}`
      //   );
      //   console.log("hello");
      //   user.favoritesChara.push(response.data);
      // } else {
      //   user.favoritesChara.splice(i - 1, 1);
      // }
      // await user.save();
      // res.json(user);

      let x = -1;
      let i = 0;
      for (i; i < user.favoritesChara.length; i++) {
        if (user.favoritesChara[i]._id === charaId._id) {
          x = i;
          break;
        }
      }

      console.log(i);
      // const i = user.favoritesComics.indexOf(comicId);
      if (x === -1) {
        user.favoritesChara.push(charaId);
      } else {
        user.favoritesChara.splice(i, 1);
      }
      await user.save();
      res.json(user);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
