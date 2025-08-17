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
        required: true,
    },
    commentIds : {
        type : [String],
    },
    like : {
        type : Number,
    }
}, { timestamps : true })

export default mongoose.model('post', postSchema, 'posts');