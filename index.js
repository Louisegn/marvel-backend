require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI);

app.get("/", (req, res) => {
  res.status(500).json("coucou ya rien ici :p");
});

app.get("/comics", async (req, res) => {
  console.log(process.env.API_KEY);
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}&title=${req.query.title}&skip=${req.query.skip}`
    );
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/characters", async (req, res) => {
  try {
    // console.log(req.query.name);
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&name=${req.query.name}&skip=${req.query.skip}`
    );
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

// app.get("/character/:id", async (req, res) => {
//   try {
//     const response = await axios.get(
//       `https://lereacteur-marvel-api.herokuapp.com/character/${req.params.id}?apiKey=${process.env.API_KEY}`
//     );
//     res.json(response.data);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

app.post("/character/by-id", async (req, res) => {
  try {
    let tab = [];
    for (let i = 0; i < req.body.length; i++) {
      const response = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/character/${req.body[i]}?apiKey=${process.env.API_KEY}`
      );
      tab.push(response.data);
    }

    res.json(tab);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/comics/by-id", async (req, res) => {
  try {
    console.log(req.body);

    let tab = [];
    for (let i = 0; i < req.body.length; i++) {}
    res.json("coucou");
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/comics/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

const userRoutes = require("./routes/user");

app.use(userRoutes);

app.all("*", (req, res) => {
  console.log("route not found");
  res.status(404).json({ message: "route not found !" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started !");
});
