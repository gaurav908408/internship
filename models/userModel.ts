import mongoose, { Schema, Document } from "mongoose";

  mongoose.connect('mongodb://localhost:27017/todo')
          
interface IUSER{
     name:string,
     email:string,
     password:string
}

const userSchema = new Schema<IUSER>(
    {
          name:{
            type:String,
            required:true,
            trim:true

          },

          email:{
            type:String,
            required:true,
            trim:true,
            unique:true

          },
          password:{
             type:String,
             required:true,
             trim:true
          }
    }
)

  const User =    mongoose.models.User || mongoose.model<IUSER>("User", userSchema);


export default User;
