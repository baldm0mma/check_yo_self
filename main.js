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

var taskItems = [];
var todoCards = JSON.parse(localStorage.getItem("todos")) || [];

// window.addEventListener('load', onLoad);
// searchInput.addEventListener('input', ???);
// searchButton.addEventListener('click', ????);
// taskTitleInput.addEventListener('input', ????);
// taskItemInput.addEventListener('input', ????);
addTaskItemButton.addEventListener('click', addToList);
// makeTaskListButton.addEventListener('click', ???);
// clearAll.addEventListener('click', ???);
// filterUrgency.addEventListener('click', ????);
// cardArea.addEventListener('click', ????);

function onLoad() {

}

function addToList() {
  var listText = `
    <li class="sidebar__insert-list">
      <p class="sidebar__insert-list--check-mark">x</p>
      <p class="sidebar__insert-list--text">${taskItemInput.value}</p>
    </li>`
  listAddArea.insertAdjacentHTML('beforeend', listText);
  clearInput();
}

function clearInput() {
  taskItemInput.value = "";
}