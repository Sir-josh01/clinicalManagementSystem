import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected Safely: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error (Database did not connect): ${error.message}`);
        // Exit process with failure code (1) if database cannot connect
        process.exit(1); 
    }
};

export default connectDB;