import createHttpError from "http-errors";
import jobModel from "./jobModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "node:fs";
import path from 'node:path';   
import { fileURLToPath } from 'node:url';
import userModel from "../user/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Checked All the routes, working Fine

const getAllJobs = async (req, res, next) => {

    let jobs;

    try {
        jobs = await jobModel.find();
    } catch (err) {
        console.error('Error in fetching jobs', err);
        return next(createHttpError(400, err instanceof Error ? err.message : 'Error in fetching jobs from Database'));
    }

    if(!jobs || jobs.length == 0) {
        return next(createHttpError(400, 'No job found'));
    } 

    res.status(200).json({'jobs' : jobs});

}

const postJob = async (req, res, next) => {
    const { description } = req.body;

    if(!description) {
        return next(createHttpError(401, 'Decription required'));
    }

    //Taking name from the auth

    const userId = req.userId;

    let name;

    try {
        const user = await userModel.findOne({ _id : userId});
        name = user.Username;
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Unable to fetch data'));
    }


    //Jumping directly to uploading files
    
    const files = req.files;
    
    if(!files["JobImg"] || files['JobImg'].length == 0) {
        return next(createHttpError(400,"upload an image to post"));
    }
    
    const mimeParts = files["JobImg"][0].mimetype.split("/");
    const coverImageMimeType = mimeParts[mimeParts.length - 1];
    const fileName = files["JobImg"][0].filename;
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

    let job;

    try {
        job = await jobModel.create({
            name,
            description,
            image : uploadResult.secure_url
        })
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Failed to connect Database'));
    }

    res.status(201).json({'id' : job._id});
}

const getJobById = async (req, res, next) => {

    const { jobId } = req.params;

    if(!jobId) {
        return next(createHttpError(401,'Job Id required'));
    }

    let job

    try {
       job = await jobModel.findOne({ _id : jobId }); 
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database error'));
    }

    if(!job) {
        return next(createHttpError(400,`No job is found with Id - ${jobId}`));
    }

    res.status(200).json({job});

}

const applyForJob = async (req, res, next) => {

    const { jobId } = req.params;

    if(!jobId) {
        return next(createHttpError(401,'Job Id required'));
    }

    //Get name from the auth

    const id = req.userId;

    let user;

    try {
        user = await userModel.findOne({ _id : id});
    } catch (err) {
        console.error(err);
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database error'));
    }

    const name = user.Username;

    //Adding the name in the job peopleApplied Array

    let job;

    try {
        job = await jobModel.findOne({ _id : jobId });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database error'));
    }

    if(!job) {
        return next(createHttpError(400,'This job is either do not exist or has closed'));
    }

    const peopleAppliedArray = job.peopleApplied;

    peopleAppliedArray.push(name);

    let result;

    try {
        result = await jobModel.findByIdAndUpdate({ _id : jobId }, 
            { peopleApplied : peopleAppliedArray },
            { new : true }
        );
    } catch (err) {
        return next(createHttpError(err instanceof Error ? err.message : 'Database Error'));
    }

    if(result) {
        res.status(201).json({'message':'Applied Successfully'});
    } else {
        res.status(500).json({"message" : "Internal Server Error"});
    }
}

const deleteJob = async (req, res, next) => {
    const { jobId } = req.params;

    if(!jobId) {
        return next(createHttpError(401,'Job Id required'));
    }

    try {
        await jobModel.deleteOne({ _id : jobId });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database problem'));
    }

    res.status(200).json({'message':'Job deleted successfully'});
}

export { getAllJobs, postJob, getJobById ,applyForJob, deleteJob}