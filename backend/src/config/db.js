import mongoose from "mongoose";
import { config } from "./config.js";

const connectToDb = async() => {
    try {

        mongoose.connection.on('connected', ()=> {
            console.log('Database connected');
        })

        mongoose.connection.on('error', (err)=>{
            console.log('Error in connecting to Database', err);
        })

        await mongoose.connect(config.databaseURI);
    } catch (err) {
        console.error('Failed to connect to Database',err);
        process.exit(1);
    }
}

export default connectToDb;