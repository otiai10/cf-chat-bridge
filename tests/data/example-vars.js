var secrets = {};
try {
  secrets = require("./test-secret-vars");
} catch (e) {
  // do nothing.
}

module.exports = {
  "GOOGLE_API_KEY": process.env.GOOGLE_API_KEY || secrets.GOOGLE_API_KEY
}
