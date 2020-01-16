//once one is logged in, they can't see the register or login pages

const User = require("../database/models/User");

module.exports = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/");
    
  }

  next();
};