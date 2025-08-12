const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.js");
const Seller = require("../models/sellerSchema.js");

const authenticateToken = async (req, res, next) => {
    // Try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies?.authToken;

    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Optional: Verify user still exists in database
        let userExists;
        if (decoded.role === 'user') {
            userExists = await User.findById(decoded.userId);
        } else if (decoded.role === 'seller') {
            userExists = await Seller.findById(decoded.userId);
        }

        if (!userExists) {
            return res.status(401).json({
                success: false,
                message: 'User account no longer exists'
            });
        }

        req.user = decoded; // Add user info to request
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Role-based authorization
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        next();
    };
};

// Check if user owns the resource or is admin
const checkOwnership = async (req, res, next) => {
    try {
        const targetUserId = req.params.id || req.params.userId;

        // Allow if it's the same user or admin role
        if (req.user.userId === targetUserId || req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only access your own resources'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization check failed',
            error: error.message
        });
    }
};

module.exports = { authenticateToken, requireRole, checkOwnership };
