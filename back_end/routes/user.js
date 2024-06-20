const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const isUserExists = await User.findOne({ email: req.body.email });
    if (isUserExists) {
      return res.status(409).send({ meesage: "User Already Exists" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hasedPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hasedPassword }).save();
    return res.status(201).send({ meesage: "User Created Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ meesage: "Internal Server Error at login Signup" });
  }
});

module.exports = router;
