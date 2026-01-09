const express=require("express");
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const cors=require("cors");
const { createSchema, createtodo } = require("./types");
const { user,todo}=require("./db");
const { hash } = require("zod");
const bcrypt=require("bcrypt");
const {usermiddleware} = require("./auth");
const jwt=require("jsonwebtoken");
require("dotenv").config();
app.use(cors());



const Port=process.env.PORT||3000;

app.post("/signup",async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    
    const response=createSchema.safeParse(req.body);
    if(!response.success){
        res.status(400).json({
            msg:"Invalid inputs"
        })
        return
    }
    
    
   const existinguser= await user.findOne({
        username
    })
    if(existinguser){
        res.status(403).json({
            msg:"username already exists"
        })
        return
    }
    

    const hashedpassword=await bcrypt.hash(password,10);
    await user.create({
        username,
        password:hashedpassword

    })
    res.json({
        msg:"user created successfully"
    })

});


app.post("/signin",async(req,res)=>{
    const {username,password}=req.body;

    const isuser=await user.findOne({
        username
    })
    if(!isuser){
        res.status(403).json({
            msg:"user not found"
        })
        return
    }

    
              const hashedpassword=isuser.password;
    const ismatch=await bcrypt.compare(password,isuser.password)
    if(!ismatch){
        return res.status(401).json({
            msg:"wrong password"
        })
    }
    const token=jwt.sign({userId:isuser._id,username},process.env.JWT_SECRET,{
        expiresIn:"1h"
    })
    res.json({
        token,
    })


    
    

   


});

app.get("/profile",usermiddleware,async(req,res)=>{
 const userData=await user.findById(req.user.userId).select("-password")
 res.json({
    userData
 })

    
})

app.post("/todos",usermiddleware,async (req,res)=>{
    try{
    const userId=req.user.userId;
      

          
        const{title,description}=req.body;
        const tododata=createtodo.safeParse(req.body);
        if(!tododata.success){
            res.status(400).json({
                msg:"invalid inputs"

            })
            return;
        }
        const founduser=await user.findById(userId);
        if(!founduser){
            res.status(404).json({
                msg:"user does not exist"
            })
            return;

        }
       const newtodo=await todo.create({
            title,
            description

        })
        await founduser.todos.push(newtodo._id);
        await founduser.save();
        
        
        res.json({
            msg:"todo created successfully",
            todo:newtodo
        })
    }catch(err){
        res.status(500).json({
            msg:"internal server error",
            error:err.message
        })
    }

        });


    
    app.get("/todos",usermiddleware,async (req,res)=>{
        try{
        const userId=req.user.userId;
        const founduser=await user.findById(userId).populate("todos");
        if(!founduser){
            res.status(404).json({
                msg:"user not found"
            })
            return;
        }
        

            
        
        res.json({
            todos:founduser.todos
        })
    }catch(err){
        res.status(500).json({
        msg:"internal server error",
        error:err.message
    })
}

         

    });



app.put("/todo/:todoId",usermiddleware,async (req,res)=>{
    try{
        const userId=req.user.userId;
        const todoId=req.params.todoId;
        const founduser=await user.findById(userId);
        if(!founduser){
            res.status(404).json({
                msg:"user not found"
            })
            return
        }
        const foundtodo=await todo.findById(todoId);
        if(!foundtodo){
            res.status(404).json({
                msg:"todo not found"
            })
            return;
        }
        
       const isOwner = founduser.todos.some(
  id => id.toString() === todoId
);

if (!isOwner) {
  return res.status(403).json({
    msg: "You are not authorized to update this todo"
  });
}
        const {completed}=req.body;
        foundtodo.completed =    completed ?? !foundtodo.completed;
    await foundtodo.save();
        res.json({
            msg:"todo updated successfully"
        })
    }catch(err){
        res.status(500).json({
            msg:"internal server error",
            error:err.message
        })
    }
    
}
)
app.delete("/todo/:todoId",usermiddleware,async (req,res)=>{
    try{
        const userId=req.user.userId;
        const todoId=req.params.todoId;
        const founduser=await user.findById(userId);
        if(!founduser){
            res.status(404).json({
                msg:"user not found"
            })
            return;
        }
    
    const foundtodo=await todo.findById(todoId);
    if(!foundtodo){
        res.status(404).json({
            msg:"todo not found"
        })
        return;
    }
    const isOwner=founduser.todos.some(
        id=>id.toString()===todoId
    )
    if(!isOwner){
        return res.status(403).json({
            msg:"you are not authorized to delete this todo"
        })
    }
    await foundtodo.deleteOne();
    await founduser.todos.pull(todoId);
    await founduser.save();
    res.json({
        msg:"todo deleted successfully"
    })
    }catch(err){
        res.status(500).json({
        msg:"internal server error",
        error:err.message
        })
    }
})

app.listen(Port,()=>{
    console.log("server is running ")
})