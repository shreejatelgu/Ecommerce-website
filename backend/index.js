const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer =require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { error } = require("console");

app.use(express.json());
app.use(cors());

// database connection with mongo db
mongoose.connect(
  "mongodb+srv://shreejatelgu57_db_user:Shreejatelgu123@cluster0.jbejnhh.mongodb.net/ECOMMERCE?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB Connection Error:", err));


//API creation
app.get("/",(request,response)=>{
    response.send("Express app is running")
})
//image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename : (req, file, cb)=>{
        return cb(null , `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage:storage
})
//creating upload end point for uplad method
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})
//schema for creating product
const Product = mongoose.model("Product", {
    id:{
        type: Number,
        required:true,
    },
    name:{
        type : String,
        required:true,
    },
    image : {
        type : String,
        required:true,
    },
    category:{
        type: String,
        required:true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type : Date,
        default:Date.now,
    },
    available:{
        type: Boolean,
        default:true,

    },
})

app.post('/addproduct', async (req,res) =>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }

    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category: req.body.category,
        new_price:req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success : true,
        name: req.body.name,
    })
})

//ccreating api for deleting products
app.post('/removeproduct' , async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log(" removed !");
    res.json({
        success:true,
        name: req.body.name
    })
})

//creating api for getting all productss
app.get('/allproducts', async(req,res)=>{
    let products = await Product.find({});
    console.log("All products fetched! ");
    res.send(products);
})
//creating schema for user model
const users = mongoose.model('users', {
    name : {
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type: Date,
        default : Date.now,
    }
})

//creating endpoint registration
app.post('/signup',async (req,res)=>{

    let check = await users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,error:"Email id exists already!"})
    }
    let cart = {};
    for (let index = 0; index <300; index++) {
        cart[index] = 0;  
    }
    const user = new users({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,

    })
//user authentication
    await user.save();   //save in the database

    const data = {
        user:{
            id:user.id   //data object that we will be using to jwt sign method
        }
    }

    const token = jwt.sign(data,'secret_ecom');  //secret is solved method so that its not readable
    res.json({success:true,token})
})

//creatin endpoint for user login
app.post('/login', async(req,res)=>{
    let user = await users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success: true,token});

        }
        else{
            res.json({success:false,error:"wrong password!"});
        }
    }
    else{
        res.json({success:false,error:"Wrong Emailid"});
    }
})


// creating endpoint for new collection data
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(-8); // get last 8 products
    console.log("New collections are fetched!!");
    res.send(newcollection);
});

//creating endpoint for popular in women section
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_inwomen = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_inwomen);
})
//creating midddelware to fetch user
const fetchuser = async(req,res,next) =>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error:"Please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({error:"please authenticate using vaild token"})
        }
    }

}

//creating endpoint for cart items saved in cart
app.post('/addtocart',fetchuser,async(req,res)=>{
    //console.log(req.body,req.user);
    console.log("Added",req.body.ItemID);
    let userData = await users.findOne({ _id: req.user.id });
    userData.cartData[req.body.ItemID] += 1;
    await users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
    res.send("Added to cart")
})
app.post('/removefromcart',fetchuser,async(req,res)=>{
    console.log("removed",req.body.ItemID);
    let userData = await users.findOne({ _id: req.user.id });
    if(userData.cartData[req.body.ItemID]>0)
    userData.cartData[req.body.ItemID] -= 1;
    await users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
    res.send("Removed from cart")
})
//creating save inn ccart
app.post('/getcart', fetchuser, async (req, res) => {
  let userData = await users.findOne({ _id: req.user.id });
  res.json(userData.cartData); // sends cart as JSON
});


app.listen(port,(error)=>{
    if(!error){
        console.log("Server is running on port : " + port)
    }
    else{
        console.log("Error:"+error)
    }
})