import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide the name of product"],
        trim: true,
        maxLength: [120, "The name of product cannot be more than 120 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please provide the price of product"],
        maxLength: [5, "The price of product cannot be more than 5 digits"]
    },
    description: {
        type :String
    },
    photos: [
        {
            secure_url: {
                type: String,
                required: true
            }
        }
    ],
    stock: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    collectionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    }

}, { timestamps: true });


export default mongoose.model("Product", productSchema);