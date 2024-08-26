const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
       type: String,
       required:true,
    },
    description:String,
    image:{
        default:"https://media.istockphoto.com/id/825319778/photo/sunset-on-beach.webp?b=1&s=170667a&w=0&k=20&c=ILkxevFi52FO-3P8fcWCXJmwiu8F0OZTtabHY-P0MMM=",
        type:String,
         set:(v)=>v===""? "https://media.istockphoto.com/id/825319778/photo/sunset-on-beach.webp?b=1&s=170667a&w=0&k=20&c=ILkxevFi52FO-3P8fcWCXJmwiu8F0OZTtabHY-P0MMM=":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
await Review.deleteMany({_id: {$in: listing.reviews}});
}});


const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;