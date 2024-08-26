const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
// const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// express-session is a npm package
app.use(session({secret:"mysupersecretstring",resave:false, saveUninitialized:true }));   //middleware
app.use(flash());
// app.get("/test",(req,res)=>{
//     res.send("test successful");
// });

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     };
    
//     res.send(`you send a request ${req.session.count} times`);
// });

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next()
});

app.get("/register",(req,res)=>{     //register/?name=renu
    let{name="anonymous"}=req.query;
    // console.log(req.session);
    req.session.name=name;
    // console.log(req.session.name);
    // res.send(name);
    if(name==="anonymous"){
        req.flash("error","user not registered!!");
    }else{
    req.flash("success","user registered succssfully!");
    };
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    // res.send(`hello, ${req.session.name}`);
    // console.log(req.flash("success"));
    // res.render("page.ejs",{name:req.session.name, msg:req.flash("success")});
    
    // res.locals.successMsg=req.flash("success");
    // res.locals.errorMsg=req.flash("error");
    res.render("page.ejs",{name:req.session.name});
});


























// app.use(cookieParser("secretCode"));   //middleware for parse(read cookies)

// // send cookies
// app.get("/getCookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("Made-in","India");
//     res.send("Send you some cookies");
// });

// // parse(read) cookies  we pass a middleware
// app.get("/cookie",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("heiilo");
// });

// app.get("/greet",(req,res)=>{
//  let{name="anonymous"}=req.cookies ;
//  res.send(`Hi, ${name}`);
// });

// app.get("/getSignedcookie",(req,res)=>{
//     res.cookie("greet","Hiee",{signed:true});
//     res.send("signed cookie send");
// });

// app.get("/verify",(req,res)=>{
//     // console.log(req.cookies);
//     console.log(req.signedCookies);
//     res.send("verified");

// });

// app.use("/users",users);
// app.use("/posts",posts);

// app.get("/",(req,res)=>{
// res.send("hii,i am root");
// });

app.listen(3000,()=>{
    console.log("server is listning the port 3000");

});


