const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (!req.session.accessToken) {
    // If there's no access token in the session, the user is not authenticated.
    return res.status(401).json({ message: "Unauthorized" });
  }

  // You can add additional checks here if needed, such as verifying the access token.

  // If the user is authenticated, proceed to the next middleware or route.
  next();
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
