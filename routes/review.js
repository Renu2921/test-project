const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
// const {  reviewSchema } = require('../schema.js');
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validataReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");


// review post route
router.post("/",isLoggedIn, validataReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    
    let {comment,rating}=req.body;
    let newReview= new Review({
      comment:comment,
      rating:rating,
    });
newReview.author=req.user._id;
    listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
    //  res.send("new review saved");
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
    }));
    
    // delete review route
    router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review Deleted!");
    res.redirect(`/listings/${id}`);
    
    }));
    
    
    module.exports=router;
    