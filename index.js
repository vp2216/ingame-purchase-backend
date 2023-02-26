const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT;
const userRoute = require("./Routes/user");
const offerRoute = require("./Routes/offers");
const secret = process.env.SECRET;
const db = require("mongoose");
const cors = require("cors");
const user = require("./Models/user");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/offer", (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secret, async (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ message: "Session expired, please login again" });
      req.user = await user.findOne({ _id: decoded.data });
      next();
    });
  } else
    return res
      .status(403)
      .json({ message: "Session expired, please login again" });
});
app.use("/user", userRoute);
app.use("/offer", offerRoute);

db.connect(process.env.ATLAS_KEY, () => console.log("Connected to db"));

app.listen(port, console.log(`Connected to port ${port}`));
