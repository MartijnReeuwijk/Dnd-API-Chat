function splitAfterCast(msg) {
  let cast = "cast";
  let text = msg;
  let words = text.split(" ");
  let castIndex = words.findIndex(word => word == cast);
  let nextWord = words[castIndex + 1];
}

const Room = (module.exports = splitAfterCast());
