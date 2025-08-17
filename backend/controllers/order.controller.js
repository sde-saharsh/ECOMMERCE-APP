import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import Stripe from 'stripe';
import Razorpay from 'razorpay';

// Global variables
const currency = 'GBP';
const deliveryCharges = 10;

// Gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const razorPayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// Placing order using COD
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId; // obtained from auth middleware
    const { items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart after placing order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: 'Order placed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing order using Stripe method
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId; // obtained from auth middleware
    const { items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery charges as a separate line item
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: 'delivery charges',
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
  const userId = req.userId;
  const { orderId, success } = req.body;

  try {
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Place order using Razorpay
const placeOrderRazorpay = async (req, res) => {

  // try {
  //   const userId = req.userId; // obtained from auth middleware
  //   const { items, amount, address } = req.body;

  //   const orderData = {
  //     userId,
  //     items,
  //     address,
  //     amount,
  //     paymentMethod: 'Razorpay',
  //     payment: false,
  //     date: Date.now(),
  //   };
  //   const newOrder = new orderModel(orderData);
  //   await newOrder.save();

  //   const options = {
  //     amount: Math.round(amount * 100), // amount in smallest currency unit
  //     currency: currency.toUpperCase(),
  //     receipt: newOrder._id.toString(),
  //   };

  //   const order = await razorPayInstance.orders.create(options);
  //   res.json({ success: true, order, orderId: newOrder._id });
  // } catch (error) {
  //   console.log(error);
  //   res.json({ success: false, message: error.message });
  // }
};


const verifyRazorpay =async(req,res)=>{
  // try {
    
  //   const {userId,razorpay_order_id} = req.body
  //   const orderInfo = await razorPayInstance.orders.fetch(razorpay_order_id)
  //   // console.log(orderInfo);
  //   if(orderInfo.status=== 'paid'){
  //     await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
  //     await userModel.findByIdAndUpdate(userId,{cartData:{}}) 
  //     res.json({success:true,message:'payment successfull'})
  //   } else{
  //     res.json({success:false,message:'payment failed'})
  //   }

  // } catch (error) {
  //   console.log(error);
  //   res.json({ success: false, message: error.message });
  // }
}

// All order data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  // placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  // verifyRazorpay
};
