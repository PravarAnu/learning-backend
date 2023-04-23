import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide the collection name"],
            trim: true,
            maxLength: [120, "Length of collection should not be more then 120 characters"]
        }
    },
    { timestamps:true }
)

export default mongoose.model("Collection", collectionSchema)