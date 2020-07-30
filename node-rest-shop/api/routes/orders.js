const express = require('express');
const mongoose = require('mongoose');
const Order = require('./models/order');
const Product = require('./models/product');
const router = express.Router();

router.get('/',(req,res, next) => {
    Order.find({},'_id products name',{populate:"productId"},(err, orders) => {
        if(err){
            res.status(400).json({
                message: err.message
            });
        }else{
            const response = {
                count: orders.length,
                allOrders: orders.map(doc => {
                    return {
                        orderId: doc._id,
                        orderItems: doc.products,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        }
    });
});

router.get('/:id', (req,res,next) => {
    const id = req.params.id;
    Order.findById(id,(err,doc)=>{
        if(err){
            res.status(404).json({
                message: err.message
            });
        }else{
            const response = {
                orderItems: doc.products.map(doc =>{
                    return {
                        productId: doc.productId,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/'+doc.productId
                        }
                    }
                })
            }
            res.status(200).json(response);
        }
    })
})

router.post('/', async (req,res,next) => {
    const products = req.body.products;
    console.log(products);
    for(let i = 0; i<products.length; i++){
        const doc = await Product.findById(products[i].productId);
        if(doc == null){
                return res.status(404).json({
                    message: "ProductId Not Valid",
                    productNotValid: products[i]
                });
        }
    }
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        products: req.body.products,
    });
    order.save((err, doc)=>{
        if(err){
            res.status(404).json({
                error: err
            });
        }else{
            res.status(200).json({
                message: "Order Saved to Database!",
                Order: doc.products.map(doc => {
                    return {
                        productId: doc.productId,
                        quantity: doc.quantity,
                        request:{
                            type: 'GET',
                            url: 'http://localhost/3000/orders/'+ doc.doc._id
                        }
                    }
                })
            });
        }
    });
});

router.delete('/:id',(req, res, next) => {
    const id = req.params.id;
    Order.findByIdAndDelete(id, (err, doc) => {
        if(err){
            res.status(400).json({
                message: "No order found"
            });
        }else{
            res.status(200).json({
                message: "Order Deleted",
                deletedOrder: doc
            });
        }
    });
});

module.exports = router;