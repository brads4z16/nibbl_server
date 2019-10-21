const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');
const ObjectId = require("mongodb").ObjectID;

//CONFIGURE DB
const db = require('./config').db;

//SET UP EXPRESS
var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next();
  });


  //ROUTES
  const userRoute = require('./__routes/user');
  const chunkRoute = require('./__routes/chunk');
  const postRoute = require('./__routes/post');

  app.use(userRoute);
  app.use(chunkRoute);
  app.use(postRoute);
  
  
// START SERVER
app.listen(8000, () => {
    console.log('*** SERVER LISTENING ON PORT 8000 ***');
    mongoose.connect(db.CONNECTION_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('*** CONNECTED TO MONGODB ***');
    })
    .catch((e) => {
        console.log('!!! ERROR CONNECTING TO MONGODB !!!');
        console.log(e);
    })
});