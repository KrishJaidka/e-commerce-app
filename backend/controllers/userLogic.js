const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const { username, email, password, ...rest } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const user = new User({
      username,
      email,
      password: hashedPassword,
      ...rest,
    });

    // Validate and save user
    await user.validate();
    await user.save();

    // Respond with created user (omit password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
