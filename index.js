const express = require('express');
const { config, engine } = require("express-edge");
const path = require('path');
const edge = require("edge.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Post = require('./database/models/Post');
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const connectFlash = require("connect-flash");

//storing sessions in mongo-db
const connectMongo = require("connect-mongo");

//imported controllers
const createUserController = require("./controllers/createUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");

// Configure Edge 
config({ cache: process.env.NODE_ENV === 'production' });

const app = new express();



//requiring mongoose
mongoose
  .connect("mongodb://localhost:27017/node-jbc", { useNewUrlParser: true })
  .then(() => "You are now connected to Mongo!")
  .catch(err => console.error("Something went wrong", err));

//storing sessions to the database
const mongoStore = connectMongo(expressSession);

app.use(
  expressSession({
    secret: "secret",
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.use(fileUpload());
app.use(engine);
app.set("views", __dirname + "/views");
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//flash messages for when a user submits a form with errors
   app.use(connectFlash()); 
   
//only display login and register links to guests
app.use("*", (req, res, next) => {
  edge.global("auth", req.session.userId);
  next();
});

//importing middleware
const storePost = require('./middleware/storePost')
app.use('/posts/store', storePost)

//once logged in one can't see register and login
const redirectIfAuthenticated = require("./middleware/redirectIfAuthenticated");
 

app.get("/auth/register",redirectIfAuthenticated, createUserController);
app.get("/auth/login",redirectIfAuthenticated, loginController);
app.post("/users/register",redirectIfAuthenticated, storeUserController);
app.post("/users/login",redirectIfAuthenticated, loginUserController);
app.get("/auth/logout", logoutController);

//displaying posts from the database to the index
app.get('/', async (req, res) => {
  const posts = await Post.find({})
  res.render('index', {
    posts
  })
});


app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get("/posts/new", (req, res) => {
  res.render('create');
});

//displaying a post when clicked
app.get("/post/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("post", {
    post
  });
});

//post request
app.post('/posts/store',async (req, res) => {
  const posts = new Post(req.body);
  try{
    await posts.save()
    console.log("item has been saved");
    res.redirect('/')
  }
  catch(err){
        res.status(400).send("unable to save to database"); 
    }


});

//posting the bill


app.listen(4000, () => {
    console.log('App listening on port 4000')
});