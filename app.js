const taskName = document.querySelector("#task_name");
const taskDescription = document.querySelector("#task_description");
const taskStatus = document.querySelector("#add_select");
const addButton = document.querySelector(".add_button");

const task_form = document.querySelector("#add_form");
const searchSelect = document.querySelector("#search_select");
const searchInput = document.querySelector("#search");
const completedCheckbox = document.querySelector("#complete");
const startedCheckbox = document.querySelector("#started");
const importantCheckbox = document.querySelector("#important");

const tasks_ul = document.querySelector(".tasks_ul");
let searchResults = [];
let tasksArray = [];

const modal = document.querySelector(".modal");
const change_task_form = document.querySelector("#change_form");
// const save_button = document.querySelector("#save_changes");
const return_button = document.querySelector("#return");
const name_change_input = document.querySelector("#change_name");
const desc_change_input = document.querySelector("#change_description");
const status_change_select = document.querySelector("#change_status");

task_form.addEventListener("submit", createTask);

function createTask(event) {
  event.preventDefault();
  const task = {};
  task.name = taskName.value;
  task.description = taskDescription.value;
  task.status = taskStatus.value;
  task.originalStatus = task.status;
  const date = new Date();
  task.creationDate = date.toLocaleString();
  task.id = tasksArray.length + 1;
  tasksArray.push(task);
  taskName.value = "";
  taskDescription.value = "";
  showAllTasks(tasksArray);
}

function addTask(task) {
  const liElement = document.createElement("li");
  liElement.classList.add("li_task");
  liElement.innerHTML = `
  <div class="text_part">
  <span>Задание: </span>
  <span id="name">${task.name}</span>
    <p>${taskToString(task)}</p> 
    <spsn>Статус: </spsn>
    <span id="status">${task.status}</span>
    </div>
    <div class="task_buttons">
    <input id=${task.id} type="checkbox" class="check">
    <button id=${task.id} class='change_button'></button>
    <button id=${task.id} class='delete_button'></button>
    </div>
    `;
  tasks_ul.appendChild(liElement);
  const checkbox = liElement.querySelector(".check");
  switch (task.status) {
    case "open":
      liElement.style.backgroundColor = "#edf49f";
      break;
    case "close":
      liElement.style.backgroundColor = "#f98c0d";
      checkbox.checked = true;
      break;
    case "critical":
      liElement.style.backgroundColor = "yellow";
      break;
  }
}

function showAllTasks(arr) {
  if (arr.length === 0)
    return (tasks_ul.textContent = "Добавьте вашу первую задачу");
  tasks_ul.innerHTML = "";
  arr.forEach((task) => addTask(task));
}

function taskToString(task) {
  return `Описание: ${task.description}<br> Дата создания: ${task.creationDate}<br>`;
}

tasks_ul.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete_button")) {
    const id = event.target.id;
    tasksArray = tasksArray.filter((task) => task.id !== +id);
    showAllTasks(tasksArray);
  }
});

let currentTask = null;

tasks_ul.addEventListener("click", (event) => {
  if (event.target.classList.contains("change_button")) {
    const id = event.target.id;
    currentTask = tasksArray.find((t) => t.id == id);
    modal.style.display = "block";

    name_change_input.value = currentTask.name;
    desc_change_input.value = currentTask.description;
    status_change_select.value = currentTask.status;
  }
});

change_task_form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentTask) {
    changeTaskInfo(currentTask);
    modal.style.display = "none";
    showAllTasks(tasksArray);
  }
});

return_button.addEventListener("click", () => {
  modal.style.display = "none";
  console.log(tasksArray);
});

function changeTaskInfo(task) {
  task.name = name_change_input.value.trim();
  task.description = desc_change_input.value.trim();
  task.status = status_change_select.value.trim();
}

function changeTaskStatus(checkbox, task, originalStatus) {
  if (originalStatus !== "close") {
    if (checkbox.checked) {
      task.status = "close";
      showAllTasks(tasksArray);
    } else {
      task.status = originalStatus;
      showAllTasks(tasksArray);
    }
  } else{
  if (checkbox.checked) {
    task.status = originalStatus;
    showAllTasks(tasksArray);
  } else {
    task.status = "open";
    showAllTasks(tasksArray);
  }
}
}

tasks_ul.addEventListener("change", (event) => {
  const checkbox = event.target;
  const id = checkbox.id;
  const li = checkbox.parentNode.parentNode;
  const task = tasksArray.find((t) => t.id == id);
  const originalStatus = task.originalStatus;
  changeTaskStatus(checkbox, task, originalStatus);
  if (checkbox.checked) {
    li.style.backgroundColor = "#f98c0d";
  } else {
    if (task.status == "critical") li.style.backgroundColor = "yellow";
    li.style.backgroundColor = "#edf49f";
  }
});

searchInput.oninput = function () {
  let input = this.value.trim();
  let results = document.querySelectorAll(".tasks_ul li span#name");
  if (input != "") {
    results.forEach((result) => {
      let result_div = result.parentNode.parentNode;
      if (result.innerText.search(input) == -1) {
        result_div.classList.add("hide");
      } else result_div.classList.remove("hide");
    });
  } else {
    results.forEach((result) => {
      let result_div = result.parentNode.parentNode;
      result_div.classList.remove("hide");
    });
  }
};

completedCheckbox.addEventListener("change", () => {
  if (completedCheckbox.checked) {
    importantCheckbox.checked = false;
    startedCheckbox.checked = false;
  }
});

importantCheckbox.addEventListener("change", () => {
  if (importantCheckbox.checked) {
    completedCheckbox.checked = false;
    startedCheckbox.checked = false;
  }
});

startedCheckbox.addEventListener("change", () => {
  if (startedCheckbox.checked) {
    completedCheckbox.checked = false;
    importantCheckbox.checked = false;
  }
});

filterTasksByStatus(completedCheckbox, "close");
filterTasksByStatus(startedCheckbox, "open");
filterTasksByStatus(importantCheckbox, "critical");

function filterTasksByStatus(checkbox, status) {
  checkbox.addEventListener("change", (event) => {
    let results = document.querySelectorAll(".tasks_ul li span#status");

    if (event.currentTarget.checked) {
      results.forEach((result) => {
        let result_div = result.parentNode.parentNode;
        if (result.textContent.trim() !== status) {
          result_div.classList.add("hide");
        } else {
          result_div.classList.remove("hide");
        }
      });
    } else {
      results.forEach((result) => {
        let result_div = result.parentNode.parentNode;
        result_div.classList.remove("hide");
      });
    }
  });
}
