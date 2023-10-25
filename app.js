const express = require('express');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const redisIo = require('./redis/redis');
const UserRoute = require('./Route/UserRoute');
const AuthRoute = require('./Route/AuthRoute');


const PORT = process.env.PORT || 3000;

const app = express ();
app.use(express.json());

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

//cors
app.use(cors({
   origin: [ 'http://'+process.env.FRONTEND_URL, 'https://www.'+process.env.FRONTEND_URL ]
}));


//JWT
var opts = {}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(new JWTStrategy(opts, function(jwt_payload, done) {
   return done(null, jwt_payload);
}));


//healthcheck
app.get("/api/health", (request, response) => {
   const status = {
      "status": "Running"
   };
   
   response.send(status);
});


//routes
app.use("/api/auth", AuthRoute);
app.use("/api/user", passport.authenticate('jwt', {session: false}), UserRoute);
