import express from 'express'
import {placeOrder,
    placeOrderStripe,
    // placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus
} 
    from '../controllers/order.controller.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import { verifyStripe } from '../controllers/order.controller.js'

const orderRouter = express.Router()


//admin feature
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//payment feature
orderRouter.post('/place',authUser,placeOrder) //COD
orderRouter.post('/stripe',authUser,placeOrderStripe) 
// orderRouter.post('/razorpay',authUser,placeOrderRazorpay) 

//user Feature
orderRouter.post('/userorders',authUser,userOrders)

//verify payment
// orderRouter.post('/verifyStripe',authUser,verifyStripe)
// orderRouter.post('/verifyRazorpay',authUser,verifyRazorpay)

export default orderRouter