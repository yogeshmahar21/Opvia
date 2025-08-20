import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    companyName : {
        type: String,
    },
    location : {
        type: String,
    },
    description : {
        type: String,
        required: true,
    },
    image : {
        type: String,
    },
    peopleApplied : {
        type : [String]
    }  
}, {timestamps : true}
);

export default mongoose.model('Job', jobSchema, 'jobs');