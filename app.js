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

const isColor = true;

const task = {};

addButton.addEventListener("click", createTask);
searchButton.addEventListener("click", searchTaskByName);

function createTask() {
  task.name = taskName.value;
  taskName.value = "";
  task.description = taskDescription.value;
  taskDescription.value = "";
  task.status = taskStatus.value;
  task.creationDate = date.toLocaleString();

  tasksArray.push(task);
  showTask(task);
}

function showTask(task) {
  const div = document.createElement("div");
  div.classList.add("task_field");

  const taskParagraph = document.createElement("p");
  taskParagraph.innerText = taskToString(task);

  const deleteButton = createDeleteButton();
  div.appendChild(taskParagraph);
  div.appendChild(deleteButton);
  tasksDiv.appendChild(div);
}

function taskToString(task) {
  return `Задача: ${task.name}\n Описание:${task.description}\n Дата создания: ${task.creationDate}\n Статус: ${task.status}`;
}

function createDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete_btn");
  deleteButton.onclick = function () {
    tasksDiv.removeChild(deleteButton.parentElement);
    tasksArray.pop(task);
  };
  return deleteButton;
}

function createCheckButton(div) {
  const checkButton = document.createElement("button");
  // const originalColor = document.
  checkButton.classList.add("check_btn");
  checkButton.addEventListener("click", function () {
    if (isColor) {
      div.style.color = newColor; // Меняем на новый цвет
    } else {
      div.style.color = originalColor; // Возвращаем первоначальный цвет
    }
    // Переключаем флаг
    islColor = !isColor;
  });
  return checkButton;
}

function searchTaskByName() {
  const input = searchInput.value;
  const searchStatus = searchSelect.value;
  const regex = new RegExp(input, "i");
  searchResults = tasksArray.filter((item) => regex.test(item.name));
  resultsDiv.innerHTML = "";

  if (searchResults.length > 0) {
    searchResults.forEach((result) => {
        if(searchStatus === result.status){
      const div = document.createElement("div");
      div.textContent = taskToString(result);
      resultsDiv.appendChild(div);
    }
    }); 
     console.log(searchResults);
    searchResults = [];
  } else {
    resultsDiv.textContent = "Ничего не найдено.";
  }
}
