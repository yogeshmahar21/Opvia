import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    name : {
        type : String,
        unique : true,
        required : true,
    },
    userStatus : {
        type: String,
    },
    skills : {
        type: [String],
        required: true,
    },
    postedJobIds : {
        type : [String],
    },
    connectionIds : {
        type : [String],
    },
    AppliedJobIds : {
        type: [String],
    },
    postIds : {
        type : [String],
    },
    profilePic : {
        type : String,
    },
});

export default mongoose.model('profile', userProfileSchema, 'UserProfiles');