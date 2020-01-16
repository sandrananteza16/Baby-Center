const mongoose = require("mongoose");



const PostSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true,
    maxlength:45
  },
  description: String,
  content: String,
  username:{ 
    type:String,
    required:true,
    minlength:5,
    maxlength:45
  },
  //image:String,
  
  createdAt: {
    type: Date,
    default: new Date()
  }
});




const Post = mongoose.model("Post", PostSchema);


module.exports = Post;
