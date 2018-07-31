const secrets = require("./test-secret-vars");

module.exports = {
  "GOOGLE_API_KEY": process.env.GOOGLE_API_KEY || secrets.GOOGLE_API_KEY
}
