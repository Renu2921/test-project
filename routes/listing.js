const express=require("express");
const router=express.Router();  //here const router is an object
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const { listingSchema} = require('../schema.js');
const {isLoggedIn,isOwner,validataListing}=require("../middleware.js");


// index route all listings shows here
router.get("/",wrapAsync(async(req,res)=>{
    const allListings= await Listing.find({})
    res.render("listings/index.ejs",{allListings});
  }));
  // ----------------------------------------------
  // create route---> a form to create a new listing -->in index.ejs the form willl send a get request a route listings/new 
  // firstly a get request at /listings/new which gives a from when form submit a post request to the /listings
  // new route
  router.get("/new",isLoggedIn,wrapAsync(async(req,res)=>{
    // console.log("req.user");
    // if(!req.isAuthenticated()){
    //   req.flash("error","You must be logged in to create listing");
    //   return res.redirect("/login");
    // };
      res.render("listings/new.ejs");
   }));
  
  //  create route===here we accept a post request at /listings pe
  router.post("/",isLoggedIn, validataListing,wrapAsync(async(req,res,next )=>{
      let {title,description,image,price,country,location}=req.body;
  
    let newListing=new Listing({
      title:title,
      description:description,
      image:image,
      price:price,
      country:country,
      location:location
    });
    // console.log(newListing);
    // console.log(req.body);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
  }
  )
  );
  
  
  // ------------------------------------------------
  // show route
  router.get("/:id",wrapAsync(async(req,res)=>{
      let{id}=req.params;
    const listing= await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"author"
      }
    })
      .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
  }));
  
  
  // edit and update route
  router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(async(req,res)=>{
      let{id}=req.params;
      const listing=await Listing.findById(id);
      if(!listing){
        req.flash("error","Listing you requested for does not exist!");
       return  res.redirect("/listings");
      }
      res.render("listings/edit.ejs",{listing})
  }));
  
  router.put("/:id",isLoggedIn,isOwner,validataListing,wrapAsync(async(req,res)=>{
      let {id}=req.params;
      let{title:newTitle,description:newDescription, image:newImage,
         price:newPrice,
        country:newCountry,
        location:newLocation}=req.body;
        
        let updateListing= await Listing.findByIdAndUpdate(id,{title:newTitle,description:newDescription, image:newImage,
          price:newPrice,
         country:newCountry,
         location:newLocation});
        //  res.redirect("/listings");
        req.flash("success","listing Updated!");
         res.redirect(`/listings/${id}`);
  }));
  
  
  // Delete route
  router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing Deleted!");
    res.redirect("/listings");
  }));
  

  module.exports=router;
  