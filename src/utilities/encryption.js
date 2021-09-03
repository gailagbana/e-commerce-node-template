require("dotenv").config();
const { promisify } = require("util");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signJWT = promisify(jwt.sign);
const verifyJWT = promisify(jwt.verify);
const { JWT_SECRET_KEY, SALT } = process.env;

async function generateEncryption() {
  const crypt = crypto.randomBytes(32).toString("hex");
  return crypt;
}

async function generateAuthToken(user) {
  const token = await signJWT({ ...user }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
}

async function verifyAuthToken(token) {
  const verifiedObject = await verifyJWT(token, JWT_SECRET_KEY);
  return verifiedObject;
}

async function hashObject(object) {
  const saltRounds = await bcrypt.genSalt(Number(SALT));
  const encryptedPassword = await bcrypt.hash(object, saltRounds);
  return encryptedPassword;
}

async function verifyObject(sentObject, dbObject) {
  const isTheSame = await bcrypt.compare(sentObject, dbObject);
  return isTheSame;
}

module.exports = {
  generateAuthToken,
  generateEncryption,
  verifyAuthToken,
  hashObject,
  verifyObject,
};
