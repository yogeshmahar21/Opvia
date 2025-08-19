import jwt from 'jsonwebtoken';
import { config } from '../config/config.js'
import createHttpError from "http-errors"

const ProfileAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const Token = authHeader.split(' ')[1];

        const decoded = jwt.verify(Token, config.secret );

        req.userId = decoded.sub;

        let username;

        try {
            const user = await fetch(`http://localhost:5000/api/users/${req.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            const data = await user.json();

            if(user.ok) {
                username = data.Username;
                req.username = username;
            } else {
                return next(createHttpError(400,'unauthorized'));
            }
        } catch (err) {
            return next(createHttpError(400, err instanceof Error ? err.message : 'unable to fetch user'));
        }

    } else {
        return next(createHttpError(401,'Token is expired'));
    }

    next();
}

export default ProfileAuth;