
    const user1=document.getElementById("user1");
    const user2=document.getElementById("user2");
    const title=document.getElementById("first");
    const des=document.getElementById("second");
    
    const btn=document.getElementById("btn1");
    const msg=document.getElementById("msg");
    const todolist=document.getElementById("space");

    const btn2=document.getElementById("btn2");
    const btn3=document.getElementById("btn3");

    const loginsection=document.getElementById("user");
    const todosection=document.getElementById("todo");


    const API="http://localhost:3000";

   /* login --------------*/

        btn.addEventListener('click',async()=>{
            const username=user1.value;
            const password=user2.value;
        



    try{
        
        const res=await fetch(`${API}/signin`,{
        method:"POST",
        body:JSON.stringify({
            username,
            password
        }),
        headers:{

          "Content-Type":  "application/json"}

        });
        const data=await res.json();

        if(res.ok){
            localStorage.setItem("token",data.token);
            msg.textContent="login successfull";
            loginsection.style.display="none";
            todosection.style.display="block";
        }else{
            msg.textContent=data.msg;
        }


        

    }catch(err){
        console.err("Login error",err);
        msg.textContent="An error occur during login"

    }
     

});
    

/* ---------- LOGOUT ---------- */
btn2.addEventListener("click", () => {
  localStorage.removeItem("token");
  todosection.style.display = "none";
  loginsection.style.display = "block";
  todolist.innerHTML = "";
});


    const token=localStorage.getItem("token");

    try{
        const res=await fetch(`${API}/todos`,{
            method:"GET",
            headers:{
                "Authorization":`Bearer ${token}`

            }
            
        })
        const data=await res.json();
        if(res.ok){
            data.todos.forEach((todo)=>{
                const li=document.createElement("li");
                li.textContent=`${todo.title}:${todo.description}`;
                todolist.appendChild(li);

                 

            });
        }else{
            todolist.textContent=data.msg;

        }
        }
        catch(err){
            console.err("Fetch todos error",err);
            todolist.textContent="An error occurred while fetching todos";
        }
    
 async function createtodo(){

 btn3.addEventListener('click',async()=>{
   const title=title;
    const description=des;
    const token=localStorage.getItem("token");
    try{
      const res= await fetch(`${API}/todos`,{
            method:"POST",
            body:JSON.stringify({
                title,
                description

            }),
            headers:{
                "Authorization":`Bearer ${token}`,
                "Content-Type":"application/json",

            }

        })
        const data=await res.json();
        if(res.ok){
            const li=document.createElement("li");
            li.textContent=`${data.todo.title}:${data.todo.description}`;
            todolist.appendChild(li);

        }
        else{
        todolist.textContent=data.msg;

    }

    }catch(err){
        console.err("Create todo error",err);
        todolist.textContent="An error occurred while creating todo";
 }
});
 }
 createtodo();


async function updatetodo() {
    const token=localStorage.getItem("token");
    try{
        const res=await fetch(`${API}/todo/:todoId`,{
            method:"PUT",
            headers:{
                "Authorization":`Bearer ${token}`,
                "Content-Type":"application/json"

            }
        })
        const data=await res.json();
        if(res.ok){
            console.log("Todo updated:",data.todo);

        }else{
            console.log("Error updating todo:",data.msg);

        }
    }catch(err){
        console.err("while updated error",err);
        data.textContent="Error while updated todo";
    }
    
}
updatetodo();

async function deletetodo(){
    const token=localStorage.getItem("token");
    try{
        const res=await fetch(`${API}/todo/:todoId`,{
            method:"DELETE",
            headers:{
                "Authorization":`Bearer ${token}`
            }


            
        })
        const data=await res.json();
        if(res.ok){
            localStorage.clear("token");
            msg.textContent="Deleted successfull";
        }else{
            msg.textContent=data.msg;
        }
    }catch(err){
        console.err("delete todo error",err);
        msg.textContent="Error while updated"
    }
}
deletetodo();



    
