const db = require("mongoose");

const userSchema = new db.Schema(
  {
    player: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    country: { type: String, default: "IN" },
    installedDays: { type: Number, default: 0 },
    coins: { type: Number, default: 1000000 },
    gems: { type: Number, default: 1000 },
    gameLevel: { type: Number, default: 0 },
    purchaser: { type: Boolean, default: false },
    password: { type: String, required: true },
    packs:{type:String,default : ""},
  },
  { timestamps: true }
);

const user = db.model("user", userSchema);

module.exports = user;
