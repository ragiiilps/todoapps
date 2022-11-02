const todos = [];
const RENDER_EVENT = "render_todo";

function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, time, isComplete) {
  return {
    id,
    task,
    time,
    isComplete,
  };
}

function addTodo() {
  const text = document.getElementById("title").value;
  const time = document.getElementById("date").value;

  const generatedId = generateId();

  const todoObject = generateTodoObject(generatedId, text, time, false);

  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = "";

  const completedTodos = document.getElementById("completed-todos");
  completedTodos.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    console.log(todoElement);
    if (!todoItem.isComplete) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTodos.append(todoElement);
    }
  }
});

function addToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget === null) return;

  todoTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodo(todoId) {
  for (todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget === null) return;

  todoTarget.isComplete = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }

  return -1;
}

function makeTodo(todoObject) {
  const textField = document.createElement("h2");
  textField.innerText = todoObject.task;

  const timeField = document.createElement("p");
  timeField.innerText = todoObject.time;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textField, timeField);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);

  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", () => {
      undoTaskFromCompleted(todoObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("trash-button");

    removeButton.addEventListener("click", () => {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, removeButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", () => {
      addToCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo();
  });
});
