function signup(req, res, next) {
  console.log("test");
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let charactername = req.body.charactername;
  console.log(name);
  if (!email || !password) {
    return res.status(400).send("Email of wachtwoord missen");
  } else {
    return new Promise((resolve, reject) => {
      saveUser(name, email, password, charactername)
      .then(res.redirect("/"))
    });
  }
};
const SignUp = (module.exports = signup(req, res, next);
