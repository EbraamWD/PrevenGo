import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: "No token provided, authorization denied" });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        if (!token) {
            return res.status(401).json({ msg: "No token provided, authorization denied" });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from token
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({ msg: "User not found" });
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ msg: "Token expired" });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ msg: "Invalid token" });
            }
            return res.status(401).json({ msg: "Token verification failed" });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ msg: "Server error" });
    }
};

