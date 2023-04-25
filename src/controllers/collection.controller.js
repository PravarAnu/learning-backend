import Collection from "../models/collection.schema"
import asyncHandler from "../services/asyncHandler";
import customError from "../utils/customError";


export const createCollection = asyncHandler(async () =>{
    const {name} = req.body;

    if(!name){
        throw new customError("Collection name is required", 400);
    }

    const isCollectionExist = await Collection.findOne(name);

    if(isCollectionExist){
        throw new customError("Collection already exist", 400);
    }

    const collection = await Collection.create({name});

    res.status(200).json({
        success: true,
        message: "Collection created successfully",
        collection
    })
})


export const updateCollection = asyncHandler(async (req, res) =>{
    const { name } = req.body;
    const { id: collectionId } = req.params;

    if(!name){
        throw new customError("Collection name is required");
    }

    const updatedCollection = Collection.findByIdAndUpdate(collectionId, {name}, {
        new: true,
        runValidators: true
    })

    if(!updatedCollection){
        throw new customError("Collection not found", 400);
    }


    res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        updatedCollection
    })
})

export const deleteCollection = asyncHandler(async (req, res)=> {
    const { id:collectionId } = req.params;

    const deletedCollection = await Collection.findByIdAndDelete(collectionId);

    if(!deletedCollection){
        throw new customError("Collection not found", 400);
    }

    res.status(200).json({
        success: true,
        message: "Collection deleted successfully",
        deletedCollection
    })
})

export const getAllCollection = asyncHandler(async (req, res)=>{
    const collections = await Collection.find({})

    if(!collections){
        throw new customError("No Collection found", 400);
    }

    res.status(200).json({
        success: true,
        collections
    })
})