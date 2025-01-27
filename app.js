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
  if(task.status === "status") task.status = "open";
  task.creationDate = date.toLocaleString();

  tasksArray.push(task);
  showTask(task);
}

function showTask(task) {
  const div = document.createElement("div");
  div.classList.add("task_field");
  const btnDiv = document.createElement("div");
  btnDiv.classList.add("task_buttons");
  const taskParagraph = document.createElement("p");
  taskParagraph.innerText = taskToString(task);

  const deleteButton = createDeleteButton();
  const checkButton = createCheckButton();
  div.appendChild(taskParagraph);
  btnDiv.appendChild(checkButton);
  btnDiv.appendChild(deleteButton);
  div.appendChild(btnDiv);

  tasksDiv.appendChild(div);

  // function updateTaskParagraph(){
  //   taskParagraph.innerText = taskToString(task);
  // }
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
    case "status":
      status = "Начата";
      break;
  }
  return `Задача: ${task.name}\n Описание: ${task.description}\n Дата создания: ${task.creationDate}\n Статус: ${status}`;
}

function createDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete_btn");
  deleteButton.onclick = function () {
    tasksDiv.removeChild(deleteButton.parentElement.parentElement);
    tasksArray.pop(task);
  };
  return deleteButton;
}

function createCheckButton() {
  const checkButton = document.createElement("button");
  let isChecked = true;
  checkButton.classList.add("check_btn");
  checkButton.addEventListener("click", changeTaskToComplete);
  return checkButton;

  function changeTaskToComplete(event) {
    const button = event.currentTarget;
    if (isChecked) {
      button.style.backgroundImage = "url(../img/check_mark.svg)";
      button.parentElement.parentElement.style.backgroundColor = "#603940";
      isChecked = false;
      task.status = "close";
    } else {
      button.style.backgroundImage = "none";
      button.parentElement.parentElement.style.backgroundColor = " #c89884";
      isChecked = true;
      task.status = "open";
    }
  }
}

function searchTaskByName() {
  const input = searchInput.value;
  let searchStatus = searchSelect.value; // Изменено на let
  if (searchStatus === "status") searchStatus = "open";
  const regex = new RegExp(input, "i");
  
  // Фильтрация по имени
  const filteredByName = tasksArray.filter((item) => regex.test(item.name));
  console.log(tasksArray);
  console.log(filteredByName);
  resultsDiv.innerText = "";

  // Фильтрация по статусу
  const searchResults = filteredByName.filter((result) => result.status === searchStatus);
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
