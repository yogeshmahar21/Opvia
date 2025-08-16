import createHttpError from "http-errors";
import userProfileModel from "./userProfileModel.js";
import path from 'node:path';
import cloudinary from '../config/cloudinaryConfig.js';
import fs from "node:fs";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const createProfile = async (req, res, next) => {
    const { skills, userStatus  } = req.body;

    if( !skills ) {
        return next(createHttpError(400,'Skills are required'));
    }

    const { name } = req.params;

    if(!name) {
        return next(createHttpError(401, 'Unauthorized'));
    }

    //Can do Joi vailidation here later

    //Jumping directly to uploading files
    
    const files = req.files;
    
    if(!files["ProfileImg"] || files['ProfileImg'].length == 0) {
        return next(createHttpError(400,"upload an image to post"));
    }
    
    const mimeParts = files["ProfileImg"][0].mimetype.split("/");
    const coverImageMimeType = mimeParts[mimeParts.length - 1];
    const fileName = files["ProfileImg"][0].filename;
    const filePath = path.resolve(__dirname,"../../public/data/uploads",fileName);

    let uploadResult

    try {
        uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: "JobImages",
        format: coverImageMimeType,
        });

        await fs.promises.unlink(filePath);

    } catch (err) {
        console.error(err);
        return next(createHttpError(400, "error in uploading files to cloud"));
    }

    //Checking in the database if userProfile already exists

    let profile = null;

    try {
        profile = await userProfileModel.findOne({ name });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Unable to connect DB'));
    }

    if(profile) {
        return next(createHttpError(400, 'User Already Exists'));
    }

    let newProfile;

    const skillsArray = [];

    skillsArray.push(skills);

    try {
        newProfile = await userProfileModel.create({
            name,
            skills : skillsArray,
            userStatus : userStatus ? userStatus : '',
            profilePic : uploadResult.secure_url
        });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    res.status(201).json({'ProfileID' : newProfile._id});

}

const updateSkills = async(req, res, next) => {
    const { skills } = req.body;

    if (!skills) {
        return next(createHttpError(400,'Skills required'));
    }

    const { profileId } = req.params;

    if(!profileId) {
        return next(createHttpError(400,'Unauthorized'));
    }

    //Can do Joi Validation here later

    //Adding the skills to user profile

    const skillsArray = [];

    skillsArray.push(skills);

    let profile;

    try {
        profile = await userProfileModel.findOneAndUpdate({ _id : profileId },
            { skills : skillsArray },
            { new : true }
        );
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    if(profile) {
        res.status(201).json({'message' : 'Skills Added Successfully'});
    } else {
        res.status(500).json({'message': 'Internal server error'});
    }
}

export { createProfile, updateSkills };