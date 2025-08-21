import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    description : {
        type: String,
    },
    postImg: {
        type: String,
    },
    commentIds : {
        type : [String],
    },
    like : {
        type : Number,
    },
    likedBy : {
        type: [String],
        default: []
    }
}, { timestamps : true })

export default mongoose.model('post', postSchema, 'posts');