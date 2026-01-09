const signupBtn = document.getElementById("btnSignup");
const toggleAuth = document.getElementById("toggleAuth");
const authTitle = document.getElementById("authTitle");



const user1 = document.getElementById("user1");
const user2 = document.getElementById("user2");
const titleInput = document.getElementById("first");
const descInput = document.getElementById("second");

const loginBtn = document.getElementById("btn1");
const logoutBtn = document.getElementById("btn2");
const addTodoBtn = document.getElementById("btn3");

const msg = document.getElementById("msg");
const todoList = document.getElementById("space");

const loginSection = document.getElementById("user");
const todoSection = document.getElementById("todo");

const API = "http://localhost:3000";


let isSignup = false;

toggleAuth.addEventListener("click", () => {
  isSignup = !isSignup;

  if (isSignup) {
    authTitle.innerText = "Signup";
    signupBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
    toggleAuth.innerText = "Login";
  } else {
    authTitle.innerText = "Login";
    signupBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
    toggleAuth.innerText = "Signup";
  }

  msg.textContent = "";
});
signupBtn.addEventListener("click", async () => {
  const username = user1.value;
  const password = user2.value;

  if (!username || !password) {
    msg.textContent = "Username and password are required";
    return;
  }

  try {
    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    msg.textContent = data.msg;

    if (res.ok) {
      // After successful signup → go to login
      isSignup = false;
      authTitle.innerText = "Login";
      signupBtn.style.display = "none";
      loginBtn.style.display = "inline-block";
      toggleAuth.innerText = "Signup";
    }

  } catch (err) {
    msg.textContent = "Signup failed";
  }
});


/* ---------- LOGIN ---------- */
loginBtn.addEventListener("click", async () => {
  const username = user1.value;
  const password = user2.value;

  try {
    const res = await fetch(`${API}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      msg.textContent = "Login successful";
      loginSection.style.display = "none";
      todoSection.style.display = "block";
      loadTodos();
    } else {
      msg.textContent = data.msg;
    }
  } catch (err) {
    msg.textContent = "Login error";
  }
});

/* ---------- LOGOUT ---------- */
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  todoSection.style.display = "none";
  loginSection.style.display = "block";
  todoList.innerHTML = "";
});

/* ---------- LOAD TODOS ---------- */
async function loadTodos() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/todos`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  todoList.innerHTML = "";

  data.todos.forEach(todo => {
    const div = document.createElement("div");
    div.className = "todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    checkbox.addEventListener("change", () =>
      updateTodo(todo._id, checkbox.checked)
    );

    const span = document.createElement("span");
    span.textContent = todo.title;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => deleteTodo(todo._id);

    div.appendChild(checkbox);
    div.appendChild(span);
    div.appendChild(delBtn);

    todoList.appendChild(div);
  });
}

/* ---------- CREATE TODO ---------- */
addTodoBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      title: titleInput.value,
      description: descInput.value
    })
  });

  titleInput.value = "";
  descInput.value = "";
  loadTodos();
});

/* ---------- UPDATE TODO ---------- */
async function updateTodo(id, completed) {
  const token = localStorage.getItem("token");

  await fetch(`${API}/todo/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ completed })
  });
}

/* ---------- DELETE TODO ---------- */
async function deleteTodo(id) {
  const token = localStorage.getItem("token");

  await fetch(`${API}/todo/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  loadTodos();
}

if (localStorage.getItem("token")) {
  loginSection.style.display = "none";
  todoSection.style.display = "block";
  loadTodos();
}

