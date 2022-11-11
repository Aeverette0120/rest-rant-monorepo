const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");

const { User } = db;

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({
    where: { email },
  });
  if (!user || !(await bcrypt.compare(password, user.passwordDigest))) {
    res.status(404).json({
      message: "We cannot find this user with provided email and password",
    });
    console.log("it did not work");
  } else {
    req.session.userId = user.userId;

    res.json({ user });
  }

  console.log(user);
});

router.get("/profile", async (req, res) => {
  console.log('request session userId should be this'+ req.session.userId);
  try {
    let user = await User.findOne({
      where: {
        userId: req.session.userId, //TODO currect the user ID with cookie ID
      },
    });
    res.json(user);
  } catch (e) {
    res.json(null);
  }
});

module.exports = router;
