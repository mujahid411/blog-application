import mongoose from "mongoose";
import config from 'config'

async function dbConnect(){
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to Database');
    } catch (error) {
        console.error(error)
    }
}

export default dbConnect;
