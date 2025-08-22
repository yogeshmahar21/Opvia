import jwt from 'jsonwebtoken';
import { config } from '../config/config.js'
import createHttpError from "http-errors"
import userModel from '../user/userModel.js';

const ProfileAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const Token = authHeader.split(' ')[1];

        const decoded = jwt.verify(Token, config.secret );

        req.userId = decoded.sub;

        try {
            const user = await userModel.findOne({ _id : req.userId });
            if (user) {
                req.username = user.Username;
            } else {
                return next(createHttpError(400, 'No user Exists'));
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