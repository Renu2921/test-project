const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require('./schema');
// const Review=require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



const listingRouter=require("./routes/listing.js"); //for the router
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(session({secret:"mysupersecretcode",  //middleware
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        }

 }));   
 app.use(flash());

 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

 app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.locals.currentUser=req.user;
    next();
    
 });


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"renu",
//     });
// let registeredUser= await User.register(fakeUser,"helloWorld");   //this store fake user in db
// res.send(registeredUser);
// });

const port=8080;
app.listen(port,()=>{
    console.log("server is listening the port");
});

app.get("/",(req,res)=>{
    res.send("hii i am root");
})

 main().then((result)=>{
    console.log("connection successful to db");
}).catch((error)=>{
    console.log(error);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}  

// app.get("/testListing", async (req,res)=>{
//      let sampleListing=new Listing({    //here we create document from the collection Listing
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India"
//      });
//      await sampleListing.save();
//      console.log("sample was saved");
//      res.send("succesful testing");

// });




app.use("/listings",listingRouter);  //this line for the listings router
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.get("*",(req,res)=>{
  throw new ExpressError(401,"Page not found!");
})

app.use((err,req, res, next)=>{
  // res.send("Something went wrong!");
  let{statusCode=500,message="Something Went Wrong"}=err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error.ejs",{message});
})
