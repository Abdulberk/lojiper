const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const generateToken = asyncHandler(async (user) => {


  const generatedToken = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );



  return generatedToken;
});

module.exports = { generateToken };