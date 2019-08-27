var secrets = {};
try {
  secrets = require("./test-secret-vars");
} catch (e) {
  console.warn("You might need ./tests/data/test-secret-vars.js");
}

module.exports = {
  "GOOGLE_API_KEY": process.env.GOOGLE_API_KEY || secrets.GOOGLE_API_KEY
}
