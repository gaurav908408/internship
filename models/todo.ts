import mongoose, { Schema, Document } from "mongoose";


interface ITODO{
     title:string,
     description:string
}

const todoSchema = new Schema<ITODO>(
    {
          title:{
            type:String,
            required:true,
            trim:true

          },

          description:{
            type:String,
            required:true,
            trim:true

          }
    }
)

  const Todo =    mongoose.models.Todo || mongoose.model<ITODO>("Todo", todoSchema);


export default Todo;
