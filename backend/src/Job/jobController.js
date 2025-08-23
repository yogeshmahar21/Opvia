import createHttpError from "http-errors";
import jobModel from "./jobModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "node:fs";
import path from 'node:path';   
import { fileURLToPath } from 'node:url';
import userModel from "../user/userModel.js";
import userProfileModel from "../userProfile/userProfileModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Checked All the routes, working Fine

const getAllJobs = async (req, res, next) => {

    let jobs;

    try {
        jobs = await jobModel.find().sort({ createdAt : -1 });
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
    const { title, companyName, location, description, salary } = req.body;

    if(!title || !companyName || !location || !description || !salary) {
        return next(createHttpError(401, 'All fields required'));
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
    
    // if(!files["JobImg"] || files['JobImg'].length == 0) {
    //     return next(createHttpError(400,"upload an image to post"));
    // }

    let uploadResult
    
    if(files?.JobImg && files.JobImg.length>0) {
        const mimeParts = files["JobImg"][0].mimetype.split("/");
        const coverImageMimeType = mimeParts[mimeParts.length - 1];
        const fileName = files["JobImg"][0].filename;
        const filePath = path.resolve(__dirname,"../../public/data/uploads",fileName);

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
    }

    let job;

    try {
        job = await jobModel.create({
            name,
            title,
            companyName,
            location,
            salary : salary ?? 'Negotiable',
            description,
            image : files.JobImg ? uploadResult.secure_url : ''
        })
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Failed to connect Database'));
    }

    //Adding the JobId to userProfile's postedJobIds

    let userProfile;

    try {
        userProfile = await userProfileModel.findOneAndUpdate(
            { name },
            { postedJobIds : job._id },
            { new : true }
        )
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    if(userProfile) {
        res.status(201).json({'id' : job._id});
    } else {
        res.status(400).json({'error' : 'Internal server error'});
    }
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

    //check if user has already applied for the job

    if(peopleAppliedArray.includes(name)) {
        return next(createHttpError(400,'You have already applied for this job'));
    }

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

    //Adding the jobId to userProfile's AppliedJobIds

    if(result) {

        let userProfile1;

        try {
            userProfile1 = await userProfileModel.findOne({ name });
        } catch (err) {
            return next(createHttpError(err instanceof Error ? err.message : 'Database Error'))
        }

        const appliedJobsList = userProfile1.AppliedJobIds;

        appliedJobsList.push(jobId);

        let userProfile;

        try {
            userProfile = await userProfileModel.findOneAndUpdate(
                { name },
                { AppliedJobIds : appliedJobsList },
                { new : true }
            );
        } catch (err) {
            return next(createHttpError(err instanceof Error ? err.message : 'Database Error'))
        }

        if(userProfile) {
            res.status(201).json({'message':'Applied Successfully'});
        }

    } else {
        res.status(500).json({"message" : "Internal Server Error"});
    }
}

const deleteJob = async (req, res, next) => {
    const { jobId } = req.params;

    if(!jobId) {
        return next(createHttpError(401,'Job Id required'));
    }

    //Finding the name of user from Auth

    let user;

    try {
        user = await userModel.findOne({ _id : req.userId });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    let userProfile

    try {
        userProfile = await userProfileModel.findOneAndDelete({ name : user.Username },
            { postedJobIds : jobId },
            { new : true }
        )
    } catch (err) {
        return next(createHttpError(400,err instanceof Error ? err.message : 'Database Error'));
    }

    if(userProfile) {
        try {
        await jobModel.deleteOne({ _id : jobId });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database problem'));
    }

    res.status(200).json({'message':'Job deleted successfully'});
    } else {
        res.status(500).json({'error' : 'internal server error'});
    }
}

const searchJobs = async (req, res, next) => {
    const keyword = req.query.q;

    if(!keyword.trim()) {
        console.log('Empty Keyword-returning empty jobs');
        return res.status(200).json({ jobs: [] });
    }

    try{
        const jobs = await jobModel.find({
            $or : [
                { name: { $regex: keyword, $options: 'i' } },
                { companyName: { $regex: keyword, $options: 'i' } },
                { location: { $regex: keyword, $options: 'i' } },
            ],
        });

        console.log('search results:', 'jobs');
        return res.status(200).json({ jobs });
    } catch(err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Error in searchJobs controller'));
    }
}

export { getAllJobs, postJob, getJobById ,applyForJob, deleteJob, searchJobs}