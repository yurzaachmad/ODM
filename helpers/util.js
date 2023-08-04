var jwt = require("jsonwebtoken");
var User = require("../models/User");

const secretKey = "rubicamp";

class Response {
  constructor(data, success = true) {
    this.data = data;
    this.success = success;
  }
}

const tokenValid = async (req, res, next) => {
  try {
    const headerToken = req.get("Authorization");
    const token = headerToken.replace("Bearer ", "");
    var decoded = jwt.verify(token, secretKey);
    const user = await User.findOne({ id: decoded.id });
    if (!user) return new Response("token not valid", false);
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.json(new Response("token not valid", false));
  }
};

module.exports = {
  tokenValid,
  Response,
  secretKey,
};
