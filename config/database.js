const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)

// Export config object
module.exports = {
  // uri: 'mongodb://localhost:27017/' + this.db, // Databse URI and database name
  uri: 'mongodb://david:2k13Pdj4eva@ds155252.mlab.com:55252/queue-app', //Production
  secret: crypto, // Cryto-created secret
  db: 'queue-app' // Database name
}