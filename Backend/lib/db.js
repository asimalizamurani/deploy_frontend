import mongoose, { mongo } from "mongoose";

const connectDB = async() => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`)
  } catch (error) {
    console.error("ERROR: MONGODB CONNECTION fAILED", error)
    process.exit(1)
  }
}

export default connectDB;