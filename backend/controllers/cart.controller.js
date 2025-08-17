import userModel from "../models/user.model.js";

// Add products to user cart
const addToCart = async (req, res) => {
  // console.log(" setp 1: On server");
  
  try {
    const { itemId, size } = req.body;
    // console.log(itemId + size + " ye he item id and size");
    
    const userId = req.userId;
    // console.log(userId + " user id bhi agayi")

    const userData = await userModel.findById(userId);
    // console.log("userData :", userData);
    
    if (!userData) return res.json({ success: false, message: "User not found" });

    // very important line  
    let cartData = userData.cartData ? JSON.parse(JSON.stringify(userData.cartData)) : {};
    
    console.log("Previous CartData:", userData.cartData);
    console.log("CartData to Save:", cartData);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    userData.cartData = cartData;
    console.log("UserData after cart update:", userData);
    await userData.save();
    console.log("User data saved successfully");
    res.json({ success: true, message: "added to cart" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update user cart
const updateCart = async (req, res) => {
  try {
    const userId = req.userId; 
    const { itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);

    if (!userData) return res.json({ success: false, message: "User not found" });

    let cartData = userData.cartData ? JSON.parse(JSON.stringify(userData.cartData)) : {};
    
    if (cartData[itemId]) {
      cartData[itemId][size] = quantity;
    } else {
      cartData[itemId] = { [size]: quantity };
    }

    userData.cartData = cartData;
    await userData.save();

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// Get user cart data
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId; 
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export { addToCart, updateCart, getUserCart };
