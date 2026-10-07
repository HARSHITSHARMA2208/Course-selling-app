const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req, res, next) {
    let token = req.headers.token || req.headers.authorization;
    
    if (!token) {
        return res.status(403).json({
            message: "Token missing. You are not signed in."
        });
    }

    // Extract token if sent in Bearer format
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    try {
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        if (decoded && decoded.id) {
            req.userId = decoded.id; // Standardized to req.userId
            next();
        } else {
            return res.status(403).json({
                message: "Invalid token. Access denied."
            });
        }
    } catch (error) {
        return res.status(403).json({
            message: "Session expired or invalid token. Please sign in again."
        });
    }
}

module.exports = {
    userMiddleware
};