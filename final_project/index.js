const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

//create express ap
const app = express();

// use express.json
app.use(express.json());

// stores the session data on the client within a cookie
// secret ... used to sign the session ID cookie
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// authentication
app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    // check if a user is logged in and has a valid access token
    if(req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        //verify the token
        jwt.verify(token, "access", (err, user) => {
            if(!err){
                req.user = user;
                next();
            }else{
                return res.status(403).json({message: "This user is not authenticated!"});
            }
        });
    } else {
        return res.status(403).json({message: "User is not logged in!"});
    }
});
 
const PORT =5000;

//reroute all requests to these files
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// start app
app.listen(PORT,()=>console.log("Server is running"));
