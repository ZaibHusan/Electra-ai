import mongoose from "mongoose";

const connectDb = async () => {
    try {
        // Connect specifically for CustomerMemory and standard models
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("🟢 Mongoose Connected (Business Logic)");
    } catch (error) {
        console.error("🔴 Mongoose Connection Error:", error);
        process.exit(1); // Stop the server if the DB fails to connect
    }
}

export default connectDb;