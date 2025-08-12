const User = require("../models/userSchema.js");
const Seller = require("../models/sellerSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    const { role } = req.query;
    const userData = req.body;

    try {
        let Model;

        if (role === "seller") {
            Model = Seller;
        } else if (role === "user") {
            Model = User;
        } else {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        if (!userData.password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        const existingUser = await User.findOne({ email: userData.email });
        const existingSeller = await Seller.findOne({ email: userData.email });

        if (existingUser || existingSeller) {
            return res.status(400).json({
                success: false,
                message: "Email already exists. Please use a different email or login instead."
            });
        }

        const saltValue = 10;
        userData.password = await bcrypt.hash(userData.password, saltValue);

        const newUser = new Model(userData);
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const userResponse = newUser.toObject();
        delete userResponse.password;
        // remove password from response

        return res.status(200).json({
            success: true,
            message: `${role} account created successfully`,
            data: {
                user: userResponse,
                role: role,
                token: token,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Failed to create ${role}`,
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    const { role } = req.query;
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        let Model;

        if (role === "seller") {
            Model = Seller;
        } else if (role === "user") {
            Model = User;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
            });
        }

        const user = await Model.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `${role} not found`,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            success: true,
            message: `${role} logged in successfully`,
            data: {
                user: userResponse,
                role: role,
                token: token,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};

module.exports = { signup, login };
