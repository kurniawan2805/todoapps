const todos = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
  if (isStorageExist) {
    loadDataFromStorage();
  }
});

function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

function addTodo() {
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generateID = generateId();
  const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
  todos.push(todoObject);

  // document.dispatchEvent(new Event(RENDER_EVENT));
  updateChange();
}

function makeTodo(todoObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompled(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    // not completed
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(todos);
  const uncompletedTodoList = document.getElementById("todos");
  uncompletedTodoList.innerHTML = "";
  // console.log(uncompletedTodoList);

  const completedTodoList = document.getElementById("completed-todos");
  completedTodoList.innerHTML = "";

  for (let todoItem of todos) {
    // console.log(todoItem);
    const todoElement = makeTodo(todoItem);
    // console.log(todoElement);
    if (!todoItem.isCompleted) {
      uncompletedTodoList.append(todoElement);
    } else {
      completedTodoList.append(todoElement);
    }
  }
  // console.log(uncompletedTodoList);
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
  alert("Saved");
});

function findTodo(todoId) {
  for (let todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (let idx in todos) {
    if (todos[idx].id === todoId) {
      return idx;
    }
  }
  return -1;
}

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);
  if (todoTarget) {
    todoTarget.isCompleted = true;
    // document.dispatchEvent(new Event(RENDER_EVENT));
    updateChange();
  }
}

function removeTaskFromCompled(todoId) {
  const todoTargetIndex = findTodoIndex(todoId);
  if (todoTargetIndex !== -1) {
    todos.splice(todoTargetIndex, 1);
    // document.dispatchEvent(new Event(RENDER_EVENT));
    updateChange();
  }
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget) {
    todoTarget.isCompleted = false;
    updateChange();
  }
}

function updateChange() {
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  // updateChange();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser not supported local storage!");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (let todo of data) {
      todos.push(todo);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
