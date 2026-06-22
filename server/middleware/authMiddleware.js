import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify if the user is logged in
export const protect = async (req, res, next) => {
    let token;

    // Check if the request contains a Bearer token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from the header: "Bearer <token_string>"
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 

            // Fetch the user from the database using the ID in the token, excluding the password field
            req.user = await User.findById(decoded.id).select('-password');

            // If the user no longer exists (e.g., account deleted)
            if (!req.user) {
                return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
            }

            // Grant access to the protected route
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token validation failed' });
        }
    }

    // If no token is provided in the headers
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// Middleware for Role-Based Access Control (RBAC)
export const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user was set by the preceding 'protect' middleware
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access Denied: Your role (${req.user.role}) is not authorized to access this resource.` 
            });
        }
        next();
    };
};