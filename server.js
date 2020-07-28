const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors()); // must use this before routes are set up
require("dotenv").config();

// require('crypto').randomBytes(64).toString('hex')
// to generate secret key

const logout = require("./routes/logout");
const refreshToken = require("./routes/refresh");
const products = require("./routes/products");
const customer = require("./routes/customer");
const cart = require("./routes/cart");
const orders = require("./routes/orders");
const admin = require("./routes/admin");

app.listen(3000);
app.use(express.json());
app.use(cookieParser());

const url = "/api/v1";
app.use(url + "/logout", logout);
app.use(url + "/refresh", refreshToken);
app.use(url + "/products", products);
app.use(url + "/customer", customer);
app.use(url + "/cart", cart);
app.use(url + "/orders", orders);
app.use(url + "/admin", admin);
