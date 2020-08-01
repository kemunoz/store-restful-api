const Order = require('../routes/models/order');
const Product = require('../routes/models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next) => {
    Product.find({},'_id name price',{populate:""},(err, products) => {
        if(err){
            res.status(400).json({
                message: err.message
            });
        }
        const response = {
            count: products.length,
            allProducts: products.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    });
};

exports.products_get_byId = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id,(err, product) => {
        if(err){
            res.status(400).json({
                message: err.message
            });
        }else{
            const response = {
                name: product.name,
                price: product.price
            }
            res.status(200).json({
                message: "Product Found",
                requestedProduct: response
            });
        }
    });
};
exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save((err, doc) => {
        if(err){
            res.status(404).json({
                error: err
            });
        }else{
            res.status(200).json({
                message: "Product saved to Database!",
                createdProduct: doc
            });
        }
    });
};

exports.products_update_product = async (req, res, next) => {
    const id = req.params.id;
    const updates = req.body;
    const doc = await Product.findOneAndUpdate(id,updates, {new:true});

    if(doc == null){
        res.status(404).json({
            message: "Product Not Found"
        });
    }else{
        const response = {
            message: "PATCH_REQUEST_SUCCESSFUL",
            productID: doc._id,
            productName: doc.name,
            productPrice: doc.price,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + doc._id
            }
        };
        res.status(200).json({response});
    }
};

exports.products_delete_product = (req, res, next) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id, (err, docs) => {
        if(err){
            console.log(err);
            res.status(400).json({
                message: "Product Not Found"
            });
        }else{
            res.status(200).json({
                message: "Product Deleted",
                deletedProduct: docs
            });
        }
    });
};