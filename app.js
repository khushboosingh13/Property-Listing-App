if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const app = express();
const engine = require("ejs-mate");
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const list = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const user=require("./routes/user.js");
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/userModel.js");


const MONGODBURL=process.env.MONGODB_URL ;
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- Middleware ---------

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

 const store = MongoStore.create({
        mongoUrl: MONGODBURL,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 3600, 
 })

 store.on("error", function (e) {
    console.log("mongo Session Store Error", e);
 });
app.use(session({
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
       maxAge:7*24*60*60*1000,
       httpOnly:true
    },
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


// Connect to MongoDB -----------------------------------------------------------

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error:", error);
  });

 
async function main() {
  await mongoose.connect(MONGODBURL);
}


//----------------------------------------------------------------------------------

app.use("/listing",listings);
app.use("/listing/:id/reviews",reviews);
app.use("/user",user);
// Home page
app.get("/", async (req, res) => {
  let listData = await list.find();
  res.render("listing/index", { listData });
});

// 
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
}); 


  
//------------------------------- Error MiddleWare----------------------------------

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "something went wrong" } = err;
  res.status(statuscode).render("error.ejs", { message });
});

// Connection-----------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
