const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const completedCount = document.querySelector("#completed-count");
const clearAllButton = document.querySelector("#clear-all");
const filterButtons = document.querySelectorAll("[data-filter]");
const searchInput = document.querySelector("#search-input");
const themeToggle = document.querySelector("#theme-toggle");
let todos = [];
let currentFilter = "all";
let searchText = "";

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
}

function createTodoElement(todo) {
  const li = document.createElement("li");

  li.textContent = todo.text;

  if (todo.completed) {
    li.style.textDecoration = "line-through";
  }

  const editButton = document.createElement("button");

  editButton.textContent = "Edit";

  editButton.addEventListener("click", function (event) {
    event.stopPropagation();

    const newText = prompt("Edit task:", todo.text);

    if (newText === null) {
      return;
    }

    if (newText.trim() === "") {
      return;
    }

    todo.text = newText.trim();

    saveTodos();
    renderTodos();
  });

  li.appendChild(editButton);

  return li;
}

function renderTodos() {
  todoList.innerHTML = "";

  todoCount.textContent = todos.length + " Tasks";

  const completedTodos = todos.filter(function (todo) {
    return todo.completed;
  });

  completedCount.textContent = completedTodos.length + " Completed";

  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter(function (todo) {
      return !todo.completed;
    });
  }

  if (currentFilter === "completed") {
    filteredTodos = todos.filter(function (todo) {
      return todo.completed;
    });
  }

  if (searchText.trim() !== "") {
    filteredTodos = filteredTodos.filter(function (todo) {
      return todo.text.toLowerCase().includes(searchText);
    });
  }

  filteredTodos.forEach(function (todo) {
    const li = createTodoElement(todo);

    li.addEventListener("click", function () {
      todo.completed = !todo.completed;

      saveTodos();
      renderTodos();
    });

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation();

      todos = todos.filter(function (item) {
        return item.id !== todo.id;
      });

      saveTodos();
      renderTodos();
    });

    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderTodos();
  });
});

searchInput.addEventListener("input", function () {
  searchText = searchInput.value.toLowerCase();

  renderTodos();
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = input.value;

  if (taskText.trim() === "") {
    return;
  }

  const todo = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  todos.push(todo);

  saveTodos();

  input.value = "";

  renderTodos();
});

clearAllButton.addEventListener("click", function () {
  todos = [];

  localStorage.removeItem("todos");

  renderTodos();
});
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});
loadTodos();
renderTodos();
