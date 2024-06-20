const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const validate = (data) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required().label("Email"),
      password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
  } catch (error) {
    throw error;
  }
};

router.post("/login", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(409).send({ meesage: "invalid email or password" });
    }
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword) {
      return res.status(409).send({ meesage: "invalid email or password" });
    }
    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "logged in successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ meesage: "Internal Server Error At login Route" });
  }
});
module.exports = router;
