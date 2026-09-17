import Todo from "@/models/todo"

export async function POST(request:Request)
{
          const data = await request.json()

          const createdTodo = await Todo.create(
            {
              title:data.title,
              description:data.description
            })

            return Response.json({
                 success:true,
                 message:"todo added successfully",
                 data:createdTodo
            },
            {
                status:201
            }
        )


}