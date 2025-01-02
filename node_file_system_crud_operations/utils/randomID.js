const crypto = require('crypto');

const generateRandomID = () => {
  const randomID = crypto.randomBytes(2).toString('hex');
  return randomID;
};

module.exports = { generateRandomID };
