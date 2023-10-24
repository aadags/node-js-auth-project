const express = require('express');
const cors = require('cors');
require('dotenv').config();
const UserRoute = require("./Route/UserRoute");

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

//routes

app.get("/api/health", (request, response) => {
   const status = {
      "status": "Running"
   };
   
   response.send(status);
});


//user route
app.use("/api/user", UserRoute);
