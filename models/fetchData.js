function data(endpoint) {
  const url = "http://dnd5eapi.co/api/" + endpoint;
  data = new Promise(function(resolve, reject) {
    request(url)
    .then(

    )
  });
};

const Data = (module.exports = data());
