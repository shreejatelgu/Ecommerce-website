require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// ======================= ENV VARIABLES =======================
const PORT = process.env.PORT || 4000;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;

// ======================= MONGO CONNECTION =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("🚀 Express backend is running successfully!");
});

// ======================= MULTER STORAGE =======================
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: true,
    image_url: `${SERVER_URL}/images/${req.file.filename}`,
  });
});

// ======================= PRODUCT MODEL =======================
const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// ======================= ADD PRODUCT =======================
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const product = new Product({
    id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  console.log("🟢 Product Saved");
  res.json({ success: true });
});

// ======================= REMOVE PRODUCT =======================
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("🟥 Product Removed");
  res.json({ success: true });
});

// ======================= GET ALL PRODUCTS =======================
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

// ======================= NEW COLLECTION =======================
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  res.send(products.slice(-8));
});

// ======================= POPULAR IN WOMEN =======================
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  res.send(products.slice(0, 4));
});

// ======================= USER MODEL =======================
const Users = mongoose.model("users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  date: { type: Date, default: Date.now },
});

// ======================= SIGNUP =======================
app.post("/signup", async (req, res) => {
  const check = await Users.findOne({ email: req.body.email });
  if (check) return res.status(400).json({ success: false, error: "Email already exists" });

  let cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  const user = new Users({ ...req.body, cartData: cart });
  await user.save();

  const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");
  res.json({ success: true, token });
});

// ======================= LOGIN =======================
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (!user) return res.json({ success: false, error: "Email not found" });

  if (req.body.password === user.password) {
    const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");
    return res.json({ success: true, token });
  }

  res.json({ success: false, error: "Incorrect password" });
});

// ======================= AUTH MIDDLEWARE =======================
const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, "secret_ecom").user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ======================= CART ROUTES =======================
app.post("/addtocart", fetchuser, async (req, res) => {
  let user = await Users.findById(req.user.id);
  user.cartData[req.body.ItemID] += 1;
  await Users.findByIdAndUpdate(req.user.id, { cartData: user.cartData });
  res.send("Added to cart");
});

app.post("/removefromcart", fetchuser, async (req, res) => {
  let user = await Users.findById(req.user.id);
  if (user.cartData[req.body.ItemID] > 0) user.cartData[req.body.ItemID] -= 1;
  await Users.findByIdAndUpdate(req.user.id, { cartData: user.cartData });
  res.send("Removed from cart");
});

app.post("/getcart", fetchuser, async (req, res) => {
  let user = await Users.findById(req.user.id);
  res.json(user.cartData);
});

// ======================= START SERVER =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${SERVER_URL}`);
});
