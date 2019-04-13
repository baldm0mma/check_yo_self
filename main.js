var searchInput = document.querySelector('.header__form__search--input');
var searchButton = document.querySelector('.header__form__search--button');
var taskTitleInput = document.querySelector('.sidebar__form__todo--input');
var taskItemInput = document.querySelector('.sidebar__form__todo--item--input');
var addTaskItemButton = document.querySelector('.sidebar__form__todo__item--button')
var makeTaskListButton = document.querySelector('.sidebar__form__make-task--button');
var clearAll = document.querySelector('.sidebar__form__clear-all--button');
var filterUrgency = document.querySelector('.sidebar__form__urgency--button');
var cardArea = document.querySelector('.card-zone');
var listAddArea = document.querySelector('.sidebar__form--list-items');

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
    <li class="sidebar__insert-list">
      <p class="sidebar__insert-list--check-mark">x</p>
      <p class="sidebar__insert-list--text">${taskItemInput.value}</p>
    </li>`
  listAddArea.insertAdjacentHTML('beforeend', listText);
  addItemsToArray(taskItemInput.value);
  clearTaskItemInput();
}

function addListItemToSidebar

function clearTaskItemInput() {
  taskItemInput.value = "";
}

function addItemsToArray(text) {
  var object = new Items(text);
  taskItemsArray.push(object);
  console.log(taskItemsArray);
}

function heavyWork() {
  createTodo(taskItemsArray);
  // appendCardToDOM();
}

function createTodo() {
  console.log(taskItemsArray);
  var makeNewTodoCard = new Card(taskTitleInput.value, taskItemsArray);
  todoCardsArray.push(makeNewTodoCard);
  console.log(todoCardsArray);
  makeNewTodoCard.saveToStorage();
  taskItemsArray = [];
}

// appendCardToDOM

























// -------------------------------
// function makeCard(e) {
//   e.preventDefault();
//   taskItemsArray.forEach(function(el) {
//     var item = `
//     <input type="checkbox" class="card-zone__task-card__items--checkbox">
//     <p class="card-zone__task-card__items--text">${el.content}</p>`
//   });
//   var card = `
//     <div class="card-zone__task-card">
//       <h3 class="card-zone__task-card__title">${taskTitleInput.value}</h3>
//       <div class="card-zone__task-card__items">
//         ${}
//       </div>
//       <div class="card-zone__task-card__footer">
//         <img class="card-zone__task-card__footer--urgency-button">
//         <img class="card-zone__task-card__footer--delete-button">
//       </div>
//     </div>`
//     cardArea.insertAdjacentHTML('afterbegin', card);
// }