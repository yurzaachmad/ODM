var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Response, secretKey } = require("../helpers/util");
const { options } = require(".");

/* GET users listing. */
router.post("/auth", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json(new Response("user not found", false));

    if (!user.authenticate(password))
      return res.json(new Response("password is wrong", false));

    var token = jwt.sign({ user: user._id }, secretKey);
    res.json(new Response({ email: user.firstName, token: token }));
  } catch (e) {
    console.log(e);
    res.status(500).json(new Response("something went wrong", false));
  }
});

router.get("/", async function (req, res, next) {
  try {
    const users = await User.find();
    res.json(new Response(users));
  } catch {
    console.log(e);
    res.status(500).json(new Response("something went wrong", false));
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    res.json(new Response(user));
  } catch {
    console.log(e);
    res.status(500).json(new Response("something went wrong", false));
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const { email, password } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { email, password },
      { new: true }
    );
    res.json(new Response(user));
  } catch {
    console.log(e);
    res.status(500).json(new Response("something went wrong", false));
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndRemove(id);
    res.json(new Response(user));
  } catch {
    console.log(e);
    res.status(500).json(new Response("something went wrong", false));
  }
});

module.exports = router;
