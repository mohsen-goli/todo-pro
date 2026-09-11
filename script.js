const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const completedCount = document.querySelector("#completed-count");
const clearAllButton = document.querySelector("#clear-all");
const filterButtons = document.querySelectorAll("[data-filter]");
const searchInput = document.querySelector("#search-input");
const themeToggle = document.querySelector("#theme-toggle");
const priorityInput = document.querySelector("#priority-input");
const sortInput = document.querySelector("#sort-input");

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
  const tr = document.createElement("tr");

  // Task
  const taskCell = document.createElement("td");
  taskCell.textContent = todo.text;

  // Priority
  const priorityCell = document.createElement("td");

  if (todo.priority === "high") {
    priorityCell.textContent = "🔴 High";
  } else if (todo.priority === "medium") {
    priorityCell.textContent = "🟡 Medium";
  } else if (todo.priority === "low") {
    priorityCell.textContent = "🟢 Low";
  } else {
    priorityCell.textContent = "🟡 Medium";
  }

  // Status
  const statusCell = document.createElement("td");
  statusCell.textContent = todo.completed ? "Completed" : "Active";

  // Actions
  const actionsCell = document.createElement("td");

  // Edit
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

  // Delete
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

  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);

  // Table column order
  tr.appendChild(taskCell);
  tr.appendChild(priorityCell);
  tr.appendChild(statusCell);
  tr.appendChild(actionsCell);

  // Complete / Active
  tr.addEventListener("click", function () {
    todo.completed = !todo.completed;

    saveTodos();
    renderTodos();
  });

  return tr;
}

function renderTodos() {
  todoList.innerHTML = "";

  // Total tasks
  todoCount.textContent = todos.length + " Tasks";

  // Completed tasks
  const completedTodos = todos.filter(function (todo) {
    return todo.completed;
  });

  completedCount.textContent = completedTodos.length + " Completed";

  // Filter
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

  // Search
  if (searchText.trim() !== "") {
    filteredTodos = filteredTodos.filter(function (todo) {
      return todo.text.toLowerCase().includes(searchText);
    });
  }

  // Sort by priority
  if (sortInput.value === "high") {
    filteredTodos.sort(function (a, b) {
      const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3,
      };

      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  if (sortInput.value === "low") {
    filteredTodos.sort(function (a, b) {
      const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3,
      };

      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  if (sortInput.value === "newest") {
    filteredTodos.sort(function (a, b) {
      return b.id - a.id;
    });
  }

  if (sortInput.value === "oldest") {
    filteredTodos.sort(function (a, b) {
      return a.id - b.id;
    });
  }
  // Empty state
  if (filteredTodos.length === 0) {
    const emptyRow = document.createElement("tr");

    const emptyCell = document.createElement("td");

    emptyCell.colSpan = 4;
    emptyCell.textContent = "No tasks found 📝";

    emptyRow.appendChild(emptyCell);
    todoList.appendChild(emptyRow);

    return;
  }

  // Render table rows
  filteredTodos.forEach(function (todo) {
    const row = createTodoElement(todo);

    todoList.appendChild(row);
  });
}

// Filter buttons
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

// Search
searchInput.addEventListener("input", function () {
  searchText = searchInput.value.toLowerCase();

  renderTodos();
});

// Sort
sortInput.addEventListener("change", function () {
  renderTodos();
});

// Add Todo
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = input.value;

  if (taskText.trim() === "") {
    return;
  }

  const todo = {
    id: Date.now(),
    text: taskText.trim(),
    completed: false,
    priority: priorityInput.value,
  };

  todos.push(todo);

  saveTodos();

  input.value = "";

  renderTodos();
});

// Clear All
clearAllButton.addEventListener("click", function () {
  todos = [];

  localStorage.removeItem("todos");

  renderTodos();
});

// Load Theme
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

// Theme Toggle
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// Start App
loadTheme();
loadTodos();
renderTodos();
