const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const { handleRegister } = require("./controllers/register");
const { handleSignIn } = require("./controllers/signin");
const { handleProfileGet } = require("./controllers/profile");
const { handleImage } = require("./controllers/image");

const dotenv = require("dotenv");
dotenv.config();

// //locally
// const db = knex({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     user: "ch3rry",
//     password: "",
//     database: "smart-brain",
//   },
// });

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
});

// db.select("*")
//   .from("users")
//   .then((data) => {
//     console.log(data, "<<< this is all the users data");
//   });

app.use(bodyParser.json());
app.use(cors());

// const database = {
//   users: [
//     {
//       id: "123",
//       name: "John",
//       email: "john@gmail.com",
//       password: "cookies",
//       entries: 0,
//       joined: new Date(),
//     },
//     {
//       id: "124",
//       name: "Sally",
//       email: "sally@gmail.com",
//       password: "bananas",
//       entries: 0,
//       joined: new Date(),
//     },
//   ],
//   login: [
//     {
//       id: "987",
//       hash: "",
//       email: "john@gmail.com",
//     },
//   ],
// };

app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((users) => {
      res.status(200).json(users);
    });
});

app.post("/signin", (req, res) => {
  handleSignIn(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  handleImage(req, res, db);
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
