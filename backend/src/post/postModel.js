import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description : {
        type: String,
    },
    postImg: {
        type: String,
        required: true,
    }
})

export default mongoose.model('post', postSchema, 'posts');