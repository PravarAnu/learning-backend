import Mongoose  from "mongoose";
import {s3fileUpload, s3deleteFile} from "../services/imageUpload.js"
import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js"
import formidable from "formidable";
import config from "../config/index.config.js";
import Product from "../models/product.schema.js"
import fs from "fs"

export const addProduct = asyncHandler(async (req, res)=>{
    const form = formidable({multiples: true, keepExtensions: true});

    form.parse(req, async function(err, fields, files){
        if(err){
            throw new customError(err.message || "Something went wrong", 500)
        }

        let productId = new Mongoose.Types.ObjectId().toHexString();


        if(!fields.name || !fields.price || !fields.description || !fields.collectionId){
            throw new customError("Please provide all the fields", 500);
        }


        let imgArrayResp = Promise.all(
            Object.keys(files).map( async (file, index)=>{
                const element = file[fileKey];

                const data = fs.readFileSync(element.filepath);

                const upload = await s3fileUpload({
                    bucketName: config.S3_BUCKET_NAME,
                    key: `product/${productId}/photo_${index+1}.${element.mimetype}}`,
                    body: data,
                    contentType: element.mimetype
                })
            })
        )

        let imgArray = await imgArrayResp;

        const product = await Product.create({
            _id: productId,
            photos: imgArray,
            ...fields
        })

        if(!product){
            throw new customError("Product failed to create", 400)
        }

        res.status(200).json({
            success:true,
            message: "Product is successfully created",
            product
        })
    })
})

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})

    if (!products) {
        throw new CustomError("No products found", 404)
    }

    res.status(200).json({
        success: true,
        products
    })
})

export const getProductById = asyncHandler(async (req, res) => {
    const {id: productId} = req.params

    const product = await Product.findById(productId)

    if (!product) {
        throw new CustomError("No product found", 404)
    }

    res.status(200).json({
        success: true,
        product
    })
})

export const getProductByCollectionId = asyncHandler(async(req, res) => {
    const {id: collectionId} = req.params

    const products = await Product.find({collectionId})

    if (!products) {
        throw new CustomError("No products found", 404)
    }

    res.status(200).json({
        success: true,
        products
    })
})


export const deleteProduct = asyncHandler( async (req, res)=>{
    const {id: productId} = req.params;

    const product = Product.find(productId);

    if(!product){
        throw new customError("No product found", 404);
    }

    const deletePhotos = Promise.all(
        product.photos.map(async (photo, index)=>{
            await s3deleteFile({
                bucketName: config.S3_BUCKET_NAME,
                path: `product/${productId}/photo_${index+1}.png`
            })
        })
    )

    await deletePhotos;

    await product.remove();


    res.status(200).json({
        success: true, 
        message: "Product removed successfully",
    })
})