import createHttpError from "http-errors"
import Joi from "joi";
import userModel from "./userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

const createUser = async (req, res, next) => {

    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return next(createHttpError(401,'All fields required'));
    }

    //Validation

    const userSchema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters long",
            "string.max": "Name must not be more than 30 characters long"
            }),

        email: Joi.string()
            .email({ tlds: { allow: false } }) // disables TLD enforcement (so test@test.local works too)
            .required()
            .messages({
            "string.empty": "Email is required",
            "string.email": "Email must be a valid email address"
        }),

        password: Joi.string()
            .min(8)
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
            .required()
            .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters long",
            "string.pattern.base": "Password must contain at least one uppercase, one lowercase, one number, and one special character"
        })
    });

    const { err } = userSchema.validate(req.body);

    if(err) {
        return next(createHttpError(401, err instanceof Error ? err.message : 'Data Validation Failed'));
    }

    //Check if user already exists in the database

    let existingUser;

    try {
        existingUser = await userModel.findOne({ email });
    } catch (err) {
        console.error('Database Error',err);
    }

    if (existingUser) {
        return next(createHttpError(400, 'User already exists'));
    }

    //Hashing the password

    const hashedPassword = await bcrypt.hash(password, 10)

    //Creating the user in the Database/Model

    let user;

    try {
        user = await userModel.create({
        Username : name,
        email,
        password : hashedPassword
    });
    } catch (err) {
        console.error('Database Error', err);
    }

    if (!user) {
        return next(createHttpError(500, "User could not be created"));
    }


    //JWT token gneration

    const token = jwt.sign(
        { sub : user._id.toString() },
        config.secret,
        { expiresIn : "30d" }
    );

    res.status(201).json({'token' : token});

}

export { createUser }