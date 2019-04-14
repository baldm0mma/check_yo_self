var searchInput = document.querySelector('.header__form__search--input');
var searchButton = document.querySelector('.header__form__search--button');
var taskTitleInput = document.querySelector('.sidebar__form__todo--input');
var taskItemInput = document.querySelector('.sidebar__form__todo--item--input');
var addTaskItemButton = document.querySelector('.sidebar__form__todo__item--button')
var makeTaskListButton = document.querySelector('.sidebar__form__make-task--button');
var clearAll = document.querySelector('.sidebar__form__clear-all--button');
var filterUrgency = document.querySelector('.sidebar__form__urgency--button');
var cardArea = document.querySelector('.card-zone');
var listArea = document.querySelector('.sidebar__form--list-items');

var taskItemsArray = [];
var todoCardsArray = JSON.parse(localStorage.getItem("todos")) || [];

// window.addEventListener('load', onLoad);
// searchInput.addEventListener('input', ???);
// searchButton.addEventListener('click', ????);
// taskTitleInput.addEventListener('input', ????);
// taskItemInput.addEventListener('input', ????);
addTaskItemButton.addEventListener('click', addListItemToSidebar);
makeTaskListButton.addEventListener('click', heavyWork);
// clearAll.addEventListener('click', ???);
// filterUrgency.addEventListener('click', ????);
// cardArea.addEventListener('click', ????);

function onLoad() {

}

function addListItemToSidebar() {
  var listText = `
    <li class="sidebar__insert-list item">
      <p class="sidebar__insert-list--check-mark item">x</p>
      <p class="sidebar__insert-list--text item">${taskItemInput.value}</p>
    </li>`
    listArea.insertAdjacentHTML('beforeend', listText);
  addItemsToArray(taskItemInput.value);
  taskItemInput.value = "";
}

function deleteListItemToSidebar() {
  var removeLiNodes = document.getElementById('list-items');
  while (removeLiNodes.firstChild) {
    removeLiNodes.removeChild(removeLiNodes.firstChild);
  } 
}

function addItemsToArray(text) {
  var newListItem = new Items(text);
  taskItemsArray.push(newListItem);
  console.log(taskItemsArray);
}

function heavyWork() {
  createTodo(taskItemsArray);
}

function createTodo() {
  console.log(taskItemsArray);
  var makeNewTodoCard = new Card(taskTitleInput.value, taskItemsArray);
  todoCardsArray.push(makeNewTodoCard);
  console.log(todoCardsArray);
  makeNewTodoCard.saveToStorage();
  deleteListItemToSidebar();
  taskTitleInput.value = '';
  appendCardToDOM(makeNewTodoCard);
  taskItemsArray = [];
}


function appendCardToDOM(todoCardsArray) {
  var card = `
  <div class="card-zone__task-card" data-id="${todoCardsArray.id}">
    <h3 class="card-zone__task-card__title">${todoCardsArray.title}</h3>
    <div class="card-zone__task-card__items">
      <ul>
        ${iterateThruTasks(taskItemsArray)}
      </ul>
    </div>
    <div class="card-zone__task-card__footer">
      <img class="card-zone__task-card__footer--urgency-button" id="${todoCardsArray.urgent}" src="images/urgent.svg">
      <img class="card-zone__task-card__footer--delete-button" src="images/delete.svg">
    </div>
  </div>
  `;
  cardArea.insertAdjacentHTML('afterbegin', card)
}

function iterateThruTasks(taskItemsArray) {
  var taskItemsIteration;
  for (var i = 0; i < taskItemsArray.length; i++){
    taskItemsIteration += `
      <li><input type="checkbox" data-id=${taskItemsArray[i].id} id="index ${i}"/>
      <p>${taskItemsArray[i].content}</p></li>
      `
  } return taskItemsIteration
}