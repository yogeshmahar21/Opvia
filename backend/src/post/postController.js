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
    const { userId } = req.params;

    if(!userId) {
        return next(createHttpError(401, 'user Id required'));
    }

    //Jumping directly to uploading files

    const files = req.files;

    let uploadResult;

    // if(!files["postImg"] || files['postImg'].length == 0) {
    //     return next(createHttpError(400,"upload an image to post"));
    // }

    if(files?.postImg && files.postImg.length>0) {
        const mimeParts = files["postImg"][0].mimetype.split("/");
        const coverImageMimeType = mimeParts[mimeParts.length - 1];
        const fileName = files["postImg"][0].filename;
        const filePath = path.resolve(__dirname,"../../public/data/uploads",fileName);

        try {
            uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "postImages",
            format: coverImageMimeType,
            });
    
    
            await fs.promises.unlink(filePath);
    
        } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Unable to upload to cloud'));
        }
    }

    //creating the post

    let post;

    try {
        post = await postModel.create({
            postImg : files.postImg ? uploadResult.secure_url : '',
            userId,
            description : description ? description : '',
            commentIds : [],
            like : 0
        })
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Unable to create Post'));
    }

    //Updating the post Id in the userProfile

    let userProfile;

    try {
        userProfile = await userProfileModel.findOne({ _id : userId });
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
        newUserProfile = await userProfileModel.findOneAndUpdate({ _id : userId },
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

const getPostById = async (req, res, next) => {
    const { postId } = req.params;

    if(!postId) {
        return next(createHttpError(400,'Post Id required'));
    }

    //fetching the post

    let post;

    try {
        post = await postModel.findOne({ _id : postId });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    if(!post) {
        return next(401, 'post Not found');
    }

    res.status(200).json({'post' : post});
}

const deletePost = async (req, res, next) => {
    const { postId } = req.params;

    if(!postId) {
        return next(createHttpError(400,'post Id required'));
    } 

    //Getting the name from Auth

    let user;

    try {
        user = await userModel.findOne({ _id : req.userId });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    if(!user) {
        return next(createHttpError(401, 'Unauthorized'));
    }

    const name = user.Username;

    let userProfile;

    try {
        userProfile = await userProfileModel.findOne({ name });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    if(!userProfile) {
        return next(createHttpError(400,'user Profile not found'));
    }

    //geting the array of postIds in userProfile

    const postIdList = userProfile.postIds;

    const newPostIdList = postIdList.filter(id => id!== postId);

    //updating the new postId List 

    let updatedUserProfile;

    try {
        updatedUserProfile = await userProfileModel.findOneAndUpdate(
            { name },
            { postIds : newPostIdList },
            { new : true }
        );
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    //Deleting the post from postModel

    let DeletePost;

    try {
        DeletePost = await postModel.deleteOne({ _id : postId });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Database Error'));
    }

    if(updatedUserProfile && DeletePost) {
        res.status(200).json({'message' : 'Post deleted successfully'});
    } else {
        res.status(200).json({'error' : "Internal server error"});
    }
}

const likePost = async (req, res, next) => {
    const { postId } = req.params;

    const username = req.username;

    if(!postId) {
        return next(createHttpError(400, 'post id required'));
    }

    let post;

    try {
        post = await postModel.findOne({ _id : postId });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Failed to fetch post'));
    }

    const postLikers = post.likedBy;

    //If the user unlikes
    if (postLikers.includes(username)) {
        const updatedPostLikers = postLikers.filter(Liker => Liker!==username);
        const like = post.like - 1;

        try {
            const response = await postModel.findOneAndUpdate(
                { _id : postId },
                { 
                    likedBy : updatedPostLikers,
                    like : like  
                },
                { new : true }
            );

            if(!response) {
                return next(createHttpError(400,'Unable to connect database'));
            } else {
                res.status(200).json({'message':'unliked the post'});
            }
        } catch (err) {
            return next(createHttpError(400, err instanceof Error ? err.message : 'database Error'));
        }
    } else { //If the user likes

    postLikers.push(username);

    const likes = post.like + 1;
       
    let updatedPost    

    try {
        updatedPost = await postModel.findOneAndUpdate({ _id : postId },
            { 
              like : likes,
              likedBy : postLikers  
            },
            { new : true }
        );
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Failed to update like on the post'));
    }

    if(updatedPost){
          res.status(200).json({
            like : likes,
            likedBy: postLikers
        });
    } else { 
        res.status(500).json({'error':'Internal Server Error'});
    }
    }

    
}

const getAllPosts = async (req, res, next) =>  {
    let posts;

    try {
        posts = await postModel.find().sort({ createdAt : -1 });
    } catch (err) {
        return next(createHttpError(400, err instanceof Error ? err.message : 'Error fetching posts'));
    }

    if(posts.length>0) {
        res.status(200).json({ posts });
    } else {
        return next(createHttpError(404,'No posts found'));
    }
}

export { post, getPostById, deletePost, likePost, getAllPosts }
