const taskName = document.querySelector(".task_name");
const taskDescription = document.querySelector("textarea");
const taskStatus = document.querySelector("#status");
const addButton = document.querySelector(".add_button");
const date = new Date();
const tasksDiv = document.querySelector(".tasks");
const searchSelect = document.querySelector("#search_select");
const searchInput = document.querySelector("#search");
const searchButton = document.querySelector(".search_button");
const resultsDiv = document.querySelector(".search_results");
let searchResults = [];
const tasksArray = [];

addButton.addEventListener("click", createTask);
searchButton.addEventListener("click", searchTaskByName);

function createTask() {
  const task = {};
  task.name = taskName.value;
  taskName.value = "";
  task.description = taskDescription.value;
  taskDescription.value = "";
  task.status = taskStatus.value;
  task.creationDate = date.toLocaleString();
  if (!isStringEmpty(task.name)) {
    tasksArray.push(task);
    showTask(task);
  }

  function isStringEmpty(str) {
    const str1 = String(str);
    if (str1.trim() === "") return true;
    return false;
  }
}

function showTask(task) {
  const div = document.createElement("div");
  div.classList.add("task_field");
  div.classList.add("line_break");
  if (task.status === "critical") div.style.backgroundColor = "#f6d22d";
  const btnDiv = document.createElement("div");
  btnDiv.classList.add("task_buttons");
  const taskParagraph = document.createElement("p");
  taskParagraph.innerText = taskToString(task);

  const deleteButton = createDeleteButton(task);
  const checkButton = createCheckButton(task, div, taskParagraph);
  div.appendChild(taskParagraph);
  btnDiv.appendChild(checkButton);
  btnDiv.appendChild(deleteButton);
  div.appendChild(btnDiv);

  tasksDiv.appendChild(div);
}

function taskToString(task) {
  let status = "";
  switch (task.status) {
    case "open":
      status = "Начата";
      break;
    case "critical":
      status = "Важно";
      break;
    case "close":
      status = "Завершена";
      break;
  }
  return `Задача: ${task.name}\n Описание: ${task.description}\n Дата создания: ${task.creationDate}\n Статус: ${status}`;
}

function createDeleteButton(task) {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete_btn");
  deleteButton.onclick = function () {
    tasksDiv.removeChild(deleteButton.parentElement.parentElement);
    tasksArray.pop(task);
  };
  return deleteButton;
}

function createCheckButton(task, taskDiv, taskParagraph) {
  const checkButton = document.createElement("button");
  const originalStatus = getOriginalStatus(task);
  let isChecked = true;
  checkButton.classList.add("check_btn");
  checkButton.addEventListener("click", (event) =>
    changeTaskToComplete(event, task, taskDiv, taskParagraph)
  );
  return checkButton;

  function changeTaskToComplete(event, task, taskDiv, taskParagraph) {
    const button = event.currentTarget;
    let previousStatus = task.status;

    if (isChecked) {
      button.style.backgroundImage = "url(../img/check_mark.svg)";
      taskDiv.style.backgroundColor = "#998766";
      isChecked = false;
      task.status = "close";
    } else {
      button.style.backgroundImage = "none";
      isChecked = true;

    (previousStatus === "close") ? task.status = originalStatus : task.status = previousStatus;

    (task.status === "critical") ? taskDiv.style.backgroundColor = "#f6d22d" :
    taskDiv.style.backgroundColor = "#fccc72";
    }

    taskParagraph.innerText = taskToString(task);
  }
}

function getOriginalStatus(task) {
  let originalStatus = "";
  switch (task.status) {
    case "open":
      originalStatus = "open";
      break;
    case "critical":
      originalStatus = "critical";
  }
  return originalStatus;
}
function searchTaskByName() {
  const input = searchInput.value;
  let searchStatus = searchSelect.value;
  if (searchStatus === "status") searchStatus = "open";
  const regex = new RegExp(input, "i");

  const filteredByName = tasksArray.filter((item) => regex.test(item.name));
  console.log(tasksArray);
  console.log(filteredByName);
  resultsDiv.innerText = "";

  const searchResults = filteredByName.filter(
    (result) => result.status === searchStatus
  );
  console.log(searchResults);

  if (searchResults.length > 0) {
    searchResults.forEach((result) => {
      const div = document.createElement("div");
      div.innerText = taskToString(result);
      resultsDiv.appendChild(div);
    });
  } else {
    resultsDiv.textContent = "Ничего не найдено.";
  }
}
