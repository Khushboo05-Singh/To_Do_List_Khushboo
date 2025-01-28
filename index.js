// Select elements
var todoList = JSON.parse(localStorage.getItem("todos")) || [];
var addButton = document.getElementById("add-button");
var todoInput = document.getElementById("todo-input");
var deleteAllButton = document.getElementById("delete-all");
var allTodos = document.getElementById("all-todos");
var deleteSButton = document.getElementById("delete-selected");

// Event listeners
addButton.addEventListener("click", add);
deleteAllButton.addEventListener("click", deleteAll);
deleteSButton.addEventListener("click", deleteS);

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("complete") || e.target.classList.contains("ci")) {
        completeTodo(e);
    }
    if (e.target.classList.contains("delete") || e.target.classList.contains("di")) {
        deleteTodo(e);
    }
    if (e.target.classList.contains("edit") || e.target.classList.contains("ei")) {
        editTodo(e);
    }
    if (e.target.id == "all") {
        viewAll();
    }
    if (e.target.id == "rem") {
        viewRemaining();
    }
    if (e.target.id == "com") {
        viewCompleted();
    }
});

todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        add();
    }
});

// Function to update UI & save to localStorage
function update() {
    var completedTasks = todoList.filter((ele) => ele.complete);
    var remainingTasks = todoList.filter((ele) => !ele.complete);

    document.getElementById("r-count").innerText = todoList.length.toString();
    document.getElementById("c-count").innerText = completedTasks.length.toString();

    saveToLocalStorage();
}

// Save tasks to localStorage
function saveToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todoList));
}

// Add new todo
function add() {
    var value = todoInput.value.trim();
    if (value === "") {
        alert("😮 Task cannot be empty");
        return;
    }

    todoList.push({
        task: value,
        id: Date.now().toString(),
        complete: false,
    });

    todoInput.value = "";
    update();
    renderTodos(todoList);
}

// Render todos in the UI
function renderTodos(list) {
    allTodos.innerHTML = "";
    list.forEach(element => {
        var li = document.createElement("li");
        li.id = element.id;
        li.className = "todo-item";
        li.innerHTML = `
            <p id="task-${element.id}" class="${element.complete ? 'line' : ''}">${element.task}</p>
            <div class="todo-actions">
                <button class="complete btn btn-success">
                    <i class="ci bx bx-check bx-sm"></i>
                </button>
                <button class="edit btn btn-warning">
                    <i class="ei bx bx-edit bx-sm"></i>
                </button>
                <button class="delete btn btn-error">
                    <i class="di bx bx-trash bx-sm"></i>
                </button>
            </div>
        `;
        allTodos.appendChild(li);
    });
}

// Delete a specific todo
function deleteTodo(e) {
    var deletedId = e.target.closest("li").getAttribute("id");
    todoList = todoList.filter((ele) => ele.id !== deletedId);
    update();
    renderTodos(todoList);
}

// Mark a todo as completed
function completeTodo(e) {
    var completedId = e.target.closest("li").getAttribute("id");
    todoList.forEach((obj) => {
        if (obj.id === completedId) {
            obj.complete = !obj.complete;
        }
    });
    update();
    renderTodos(todoList);
}

// Edit a todo
function editTodo(e) {
    var taskId = e.target.closest("li").getAttribute("id");
    var taskElement = document.getElementById(`task-${taskId}`);

    var inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = taskElement.innerText;
    inputField.className = "edit-input";

    taskElement.replaceWith(inputField);
    inputField.focus();

    inputField.addEventListener("blur", () => saveEdit(taskId, inputField));
    inputField.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            saveEdit(taskId, inputField);
        }
    });
}

// Save edited todo
function saveEdit(taskId, inputField) {
    var newValue = inputField.value.trim();
    if (newValue !== "") {
        todoList.forEach((obj) => {
            if (obj.id === taskId) {
                obj.task = newValue;
            }
        });
    }
    update();
    renderTodos(todoList);
}

// Delete all todos
function deleteAll() {
    todoList = [];
    update();
    renderTodos(todoList);
}

// Delete only completed todos
function deleteS() {
    todoList = todoList.filter((ele) => !ele.complete);
    update();
    renderTodos(todoList);
}

// View completed todos
function viewCompleted() {
    renderTodos(todoList.filter((ele) => ele.complete));
}

// View remaining todos
function viewRemaining() {
    renderTodos(todoList.filter((ele) => !ele.complete));
}

// View all todos
function viewAll() {
    renderTodos(todoList);
}

// Load stored todos when page loads
document.addEventListener("DOMContentLoaded", () => {
    renderTodos(todoList);
});
