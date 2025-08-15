import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    Username : {
        type: String,
        required : true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
    } 
})

export default mongoose.model('User', userSchema,'Users');