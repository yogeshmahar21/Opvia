import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    from : {
        type : String,
    },
    to : {
        type : String,
    },
    message : {
        type : String,
    },
}, { timestamps : true });

export default mongoose.model('comment', commentSchema, 'comments');