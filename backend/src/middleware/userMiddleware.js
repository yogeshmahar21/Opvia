import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { config } from "../config/config.js";

export const verifyJWT = (req, res, next) => {
    try {
        // Check for token in Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(createHttpError(401, "No token provided"));
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return next(createHttpError(403, "Invalid or expired token"));
            }
            req.user = decoded; // Attach decoded payload to req.user
            next();
        });

    } catch (error) {
        next(createHttpError(500, "Token verification failed"));
    }
};
