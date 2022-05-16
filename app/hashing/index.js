const bcrypt = require('bcryptjs');

async function hash(str) {
  const salt = await bcrypt.genSalt(10);
  const hashStr = await bcrypt.hash(str, salt);
  return hashStr;
}

async function compare(str1, str2) {
  const valid = await bcrypt.compare(str1, str2);
  return valid;
}

module.exports = {
  hash,
  compare,
};
