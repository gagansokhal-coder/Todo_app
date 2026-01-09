const {z}=require("zod");

const createSchema=z.object({
    username:z.string().min(3),
    password:z.string().min(5)
})

const createtodo=z.object({
    title:z.string(),
    description:z.string()
})


module.exports={createSchema,createtodo}
