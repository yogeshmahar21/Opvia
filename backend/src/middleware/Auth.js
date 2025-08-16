import jwt from 'jsonwebtoken';
import { config } from '../config/config.js'
import createHttpError from "http-errors"

const Auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const Token = authHeader.split(' ')[1];

        const decoded = jwt.verify(Token, config.secret );

        req.userId = decoded.sub;

    } else {
        return next(createHttpError(401,'Token is expired'));
    }

    next();
}

export default Auth;