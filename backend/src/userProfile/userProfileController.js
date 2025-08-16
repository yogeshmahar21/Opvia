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
        console.log(profile);
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

const updateStatus = async(req, res, next) => {
    const { newStatus } = req.body;

    if(!newStatus) {
        return next(createHttpError(401, 'Status required'));
    }

    const { profileId } = req.params;

    if(!profileId) {
        return next(createHttpError(401, 'Unauthorized'));
    }

    //Can do Joi validation here later

    //updating the status

    let updatedStatus;

    try {
        updatedStatus = await userProfileModel.findOneAndUpdate(
            { _id : profileId},
            { userStatus : newStatus },
        { new : true }
    );
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database error'));
    }

    if(updatedStatus) {
        return res.status(201).json({'message' : 'Status updated successfully'});
    } else {
        return next(createHttpError(500, 'Internal Server Error'));
    }

}

const connection = async(req, res, next) => {
    const { id } = req.body; //Sender's Id
    const { profileId } = req.params; //Reciever's Id

    if(!id || !profileId) {
        return next(createHttpError(400,'All fields required'));
    }

    //getting sender

    let sender;

    try {
        sender = await userProfileModel.findOne({ _id : id });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    //Adding reciever to sender's connectionIds

    const senderFriendList = sender.connectionIds;

    senderFriendList.push(profileId.toString());

    //updating sender connecionIds

    let updatedSender;

    try {
        updatedSender = await userProfileModel.findOneAndUpdate(
            { _id : id },
            { connectionIds : senderFriendList },
            { new: true }
        )
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    // Getting Reciever

    let reciever;

    try {
        reciever = await userProfileModel.findOne({ _id : profileId }); 
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    const recieverConnectionList = reciever.connectionIds;

    recieverConnectionList.push(id.toString());

    //updating reciever connecionIds

    let updatedReciever;

    try {
        updatedReciever = await userProfileModel.findOneAndUpdate(
            { _id : profileId },
            { connectionIds : recieverConnectionList },
            { new: true }
        )
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    if(updatedSender && updatedReciever) {
        res.status(201).json({'message': 'Connected'});
    }

}

export { createProfile, updateSkills, updateStatus, connection };