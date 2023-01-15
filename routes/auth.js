const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation");
const jwt = require("jsonwebtoken");
const requriesAuth = require("../middleware/permissions");

// route - GET /api/auth/test
// desc -  test the auth route
// access public
router.get("/test", (req, res) => {
  res.send("hi");
});

// route - POST /api/auth/register
// desc -  to valid and create user in db
// access private
router.post("/register", async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);
    const existingemail = await User.findOne({ email: req.body.email });
    if (!isValid) {
      res.status(400).json(errors);
      return;
    }
    if (existingemail) {
      res.status(400).json({ error: "This email was already registered" });
      return;
    }
    //hash password
    const hashPassword = await bcrypt.hash(req.body.password, 12);

    //create new User
    const newUser = new User({
      email: req.body.email,
      password: hashPassword,
      name: req.body.name,
    });
    const savedUser = await newUser.save();

    const payload = { userId: savedUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // delete password before sending to frontend
    const userTOreturn = { ...savedUser._doc, token };
    delete userTOreturn.password;
    return res.json(userTOreturn);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// route - POST /api/auth/login
// desc -  login user and return access token
// access public
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "There is problem with your login credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ error: "Your password does not match" });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // delete password before sending to frontend
    const userTOreturn = { ...user._doc };
    delete userTOreturn.password;
    return res.json({ token: token, user: userTOreturn });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// route - Get /api/auth/current
// desc -  to return authorised current user and protect routes
// access private

router.get("/current", requriesAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).send("unauthorised");
  }

  return res.json(req.user);
});

// route - PUT /api/auth/logout
// desc -  logput user and clear cookies
// access private
router.put("/logout", requriesAuth, async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
module.exports = router;
