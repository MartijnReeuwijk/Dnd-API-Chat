function saveUser(name, email, password, charactername) {
  console.log("connect");
  // compile schema to model
  // make player
  let player = new User({
    name: name,
    email: email,
    password: password,
    dm: false,
    charactername: charactername
  });

  player
    .save(function(err, user) {
      if (err) {
        return console.error(err);
      } else {
        console.log(player.charactername + " saved to collection");

      }
      // res.redirect("/")
    })
}
const saveUser = (module.exports = saveUser(name, email, password, charactername));
