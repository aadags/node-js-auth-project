const express = require('express');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const UserRoute = require('./Route/UserRoute');
const redisIo = require('./redis/redis');


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
opts.issuer = 'passport.eclathealthcare.com';
opts.audience = 'eclinic.eclathealthcare.com';
passport.use(new JWTStrategy(opts, function(jwt_payload, done) {
   //you can do second level check here
   let user = redisIo.hGetAll('user:'+jwt_payload.id);
   return done(null, user);
    
}));


//healthcheck
app.get("/api/health", (request, response) => {
   const status = {
      "status": "Running"
   };
   
   response.send(status);
});


//routes
app.use("/api/user", passport.authenticate('jwt', {session: false}), UserRoute);
