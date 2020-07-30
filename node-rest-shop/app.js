const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.connect('mongodb+srv://kemunoz:Km709997341!@cluster0-9hmw7.mongodb.net/Cluster0?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

app.use(morgan('dev'));
app.use(express.urlencoded());
app.use(express.json());

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", 
    '*');
    res.header("Access-Control-Allow-Headers", 
    "Origin, Content-Type, Accept, Authorization, X-Requested-With");

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, DELETE, GET, POST, PATCH');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) =>{
    const error = new Error('Not Found');
    error.number = 404;
    next(error);
});

app.use((error,req, res, next) => {
    res.status(error.number || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;