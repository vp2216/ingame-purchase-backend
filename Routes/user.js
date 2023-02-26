const user = require("../Models/user");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
require("dotenv").config();
const secret = process.env.SECRET;

const app = express.Router();

app.use(cors());
app.use(fileUpload());
app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const { player, password } = req.body;
    const userdata = await user.findOne({ player });
    if (!userdata) return res.status(400).json({ message: "User not registered" });
    bcrypt.compare(password, userdata.password, async (err, result) => {
      if (err)
        return res.status(500).json({
          message: "An error occured in server, please try again",
        });
      if (result) {
        const token = jwt.sign(
          {
            data: userdata._id,
          },
          secret
        );
        return res.status(200).json({
          token:token,
          message: "Login successful"
        });
      } else return res.status(400).json({ message: "Wrong password" });
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: e.message });
  }
});

app.post(
  "/register",
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        if (err.param == "age")
          return res.status(400).json({ message: "Enter a valid age" });
        if (err.param == "password")
          return res
            .status(400)
            .json({ message: "Password should have atleast 6 charecters" });
      }
      const { player, age, password } = req.body;
      const userdata = await user.findOne({ player });
      if (userdata){
        return res.status(409).json({ message: "User already registered" })}
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err)
          return res
            .status(500)
            .json({ message: "An error occured in server, please try again" });
        await user.create({
          player,
          age,
          password: hash,
        });
        return res.status(200).json({ message: "Registration successful" });
      });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "An error occured in server, please try again" });
    }
  }
);

module.exports = app;
