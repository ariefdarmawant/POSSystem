const { HTTP_STATUS } = require("../constants");
const db = require("../models");
const User = db.user;

checkDuplicateUsername = async(req, res, next) => {
  // Username
  const usernameCheck = await User.findOne({
    where: {
      username: req.body.username,
    },
  })
  if (usernameCheck) {
    res.status(HTTP_STATUS.BAD_REQUEST).send({
      message: "Username already in use!",
    });
    return;
  }

  if(!(usernameCheck)){
    next();
  }
};

const verifyRegistration = {
  checkDuplicateUsername,
};

module.exports = verifyRegistration;
