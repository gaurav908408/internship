import Todo from "@/models/todo"

export async function GET(request:Request)
{
      
      const todo = await Todo.find()

      return Response.json({
          success:true,
          message:"all todo fetch successfully",
          data:todo

      },
    {
        status:200
    })
}