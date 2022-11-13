const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("json-web-token");
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
    const tokenResult = await jwt.encode(process.env.JWT_SECRET, {
      id: user.userId,
    });
    res.json({ user, token: tokenResult.value });
  }

  console.log(user);
});
router.get("/profile", async (req, res) => {
  res.json(req.currentUser)
  // try {
  //   const [authenticationMethod, token] = req.headers.authentication.split(" ");

  //   if (authenticationMethod == "Bearer") {
  //     const result = await jwt.decode(process.env.JWT_SECRET, token);
  //     const { id } = result.value;

  //     let user = await User.findOne({
  //       where: {
  //         userId: id,
  //       },
  //     });
  //     res.json(user);
  //   }
  // } catch {
  //   res.json(null);
  // }
});

module.exports = router;
