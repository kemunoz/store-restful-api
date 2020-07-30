const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('./models/product');
const order = require('./models/order');


router.get('/',(req, res, next) => {
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
});
router.get('/:id',(req, res, next) => {
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
});

router.post('/',(req, res, next) => {
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
});

router.patch('/:id',async(req, res, next) => {
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

});

router.delete('/:id', (req, res, next) => {
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
});

module.exports = router;