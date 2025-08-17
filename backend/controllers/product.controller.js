import {v2 as cloudinary} from 'cloudinary'
import { promiseImpl } from 'ejs';
import productModel from '../models/product.model.js'


//Function for add product
const addProduct = async (req,res) => {
    
    try {
        
        const { name, description,price,category,subCategory,sizes,bestseller} = req.body;
        // console.log('Raw Files:', req.files);
        // console.log('Body:', req.body);
        
        const image1 = req.files?.image1?.[0]?.path;
        const image2 = req.files?.image2?.[0]?.path;
        const image3 = req.files?.image3?.[0]?.path;
        const image4 = req.files?.image4?.[0]?.path;

        // preparing for the cloudinaru url
        const images = [image1, image2, image3, image4].filter(item => item != undefined);
        let imagesURL = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // preparing data to send to mongodb 
        const productData = {
            name,
            description,
            category,
            price:Number(price),
            subCategory,
            bestseller :bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes) ,
            image: imagesURL,
            date: Date.now()
        }
        const product = new productModel(productData)
        await product.save()
        
        res.json({success:true, message:"product added succesfully"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

//function for list product
const listProducts = async(req,res) =>{
    try {
        
        const products = await productModel.find({})
        res.json({success:true, products})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

//function for remove product
const removeProducts = async (req, res) => {
    try {

        const deletedProduct = await productModel.findByIdAndDelete(req.body.id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, message: "Product removed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//single product info
const singleproduct = async (req, res) => {
    console.log(req.body);
    
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export {addProduct,listProducts,removeProducts,singleproduct}