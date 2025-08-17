import createHttpError from "http-errors";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cloudinary from '../config/cloudinaryConfig.js';
import fs from 'node:fs';
import userProfileModel from '../userProfile/userProfileModel.js';
import userModel from '../user/userModel.js';
import postModel from '../post/postModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const post = async (req, res, next) => {
    const { description } = req.body;

    //Getting the name from Auth

    let user;

    try {
        user = await userModel.findOne({ _id : req.userId });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    if(!user){
        return next(createHttpError(401,'Unauthorized'));
    } 

    const name = user.Username;

    //Jumping directly to uploading files

    const files = req.files;

    if(!files["postImg"] || files['postImg'].length == 0) {
        return next(createHttpError(400,"upload an image to post"));
    }

    const mimeParts = files["postImg"][0].mimetype.split("/");
    const coverImageMimeType = mimeParts[mimeParts.length - 1];
    const fileName = files["postImg"][0].filename;
    const filePath = path.resolve(__dirname,"../../public/data/uploads",fileName);

    let uploadResult;

    try {
        uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "propertyImages",
            format: coverImageMimeType,
        });
    
    
        await fs.promises.unlink(filePath);
    
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Unable to upload to cloud'));
    }

    //creating the post

    let post;

    try {
        post = await postModel.create({
            postImg : uploadResult.secure_url,
            name,
            description : description ? description : ''
        })
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Unable to create Post'));
    }

    //Updating the post Id in the userProfile

    let userProfile;

    try {
        userProfile = await userProfileModel.findOne({ name });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    if(!userProfile) {
        return next(createHttpError(400, 'No user profile found'));
    }

    const postsList = userProfile.postIds;

    postsList.push(post._id);

    let newUserProfile;

    try {
        newUserProfile = await userProfileModel.findOneAndUpdate({ name },
            { postIds : postsList }
        );
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Failed to create newUserProfile'));
    }

    if(newUserProfile) {
        res.status(201).json({'message' : 'Post uploaded successfully'});
    } else {
        return next(createHttpError(500, 'Internal Server Error'));
    }
}

export { post }