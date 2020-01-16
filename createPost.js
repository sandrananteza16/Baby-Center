//the create post will only be shown to a logged in user


module.exports = (req, res) => {
  if (req.session.userId) {
    return res.render("create");
  }

  res.redirect("/auth/login");
};