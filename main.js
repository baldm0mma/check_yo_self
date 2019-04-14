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
var deleteListItemFromSidebar = document.querySelector('.sidebar__insert-list--delete-button');

var taskItemsArray = [];
var todoCardsArray = JSON.parse(localStorage.getItem("todos")) || [];

// window.addEventListener('load', onLoad);
// searchInput.addEventListener('input', ???);
// searchButton.addEventListener('click', ????);
// taskTitleInput.addEventListener('input', ????);
// taskItemInput.addEventListener('input', ????);
addTaskItemButton.addEventListener('click', addItemsToArray);
makeTaskListButton.addEventListener('click', heavyWork);
// clearAll.addEventListener('click', ???);
// filterUrgency.addEventListener('click', ????);
// cardArea.addEventListener('click', ????);
listArea.addEventListener('click', deleteSidebarListItem);

function onLoad() {

}

function addListItemToSidebar(newListItem) {
  var listText = `
    <li class="sidebar__insert-list item" data-id="${newListItem.id}">
      <img class="sidebar__insert-list--delete-button item" src="images/delete.svg" alt="Delete task from sidebar list"/>
      <p class="sidebar__insert-list--text item">${newListItem.content}</p>
    </li>`
    listArea.insertAdjacentHTML('beforeend', listText);
  taskItemInput.value = "";
}

function deleteSidebarListItem(e) {
  console.log(e.target);
  if (e.target.className === 'sidebar__insert-list--delete-button') {
    var item = e.target.closest('.sidebar__insert-list');
    console.log(item);
    item.remove();
    // var indexToRemove = findListItemIndex(item);
    // removeListItemData(indexToRemove);
    // if (document.querySelectorAll('.card').length === 0) {
    //   showPrompt();
  }
}

function findListItemIndex(item) {
  var itemId = item.dataset.id;
  return taskItemsArray.findIndex(function(item) {
    return item.id == itemId;
  });
}

function removeListItemData(index) {
  var listItemForDeletion = taskItemsArray[index];
  listItemForDeletion.splice(index, 1);
}

function deleteListItemToSidebar() {
  var removeLiNodes = document.getElementById('list-items');
  while (removeLiNodes.firstChild) {
    removeLiNodes.removeChild(removeLiNodes.firstChild);
  } 
}

function addItemsToArray() {
  var newListItem = new Items(taskItemInput.value);
  taskItemsArray.push(newListItem);
  console.log(taskItemsArray);
  addListItemToSidebar(newListItem);
}

function heavyWork() {
  createTodo(taskItemsArray);
}

function createTodo() {
  console.log(taskItemsArray);
  var newTodoCard = new Card(taskTitleInput.value, taskItemsArray);
  console.log(newTodoCard.taskList.length);
  todoCardsArray.push(newTodoCard);
  console.log(todoCardsArray);
  newTodoCard.saveToStorage();
  deleteListItemToSidebar();
  taskTitleInput.value = '';
  appendCardToDOM(newTodoCard);
  taskItemsArray = [];
}


function appendCardToDOM(newTodoCard) {
  var card = `
  <div class="card-zone__task-card" data-id="${newTodoCard.id}">
    <h3 class="card-zone__task-card__title">${newTodoCard.title}</h3>
    <div class="card-zone__task-card__items">
      <ul>
        
      </ul>
    </div>
    <div class="card-zone__task-card__footer">
      <img class="card-zone__task-card__footer--urgency-button" id="${newTodoCard.urgent}" src="images/urgent.svg">
      <img class="card-zone__task-card__footer--delete-button" src="images/delete.svg">
    </div>
  </div>
  `;
  cardArea.insertAdjacentHTML('afterbegin', card)
}

function iterateThruTasks(newTodoCard) {
  var taskListIteration;
  for (var i = 0; i < newTodoCard.taskList.length; i++){
    taskListIteration += `
      <li>
        <input type="checkbox" data-id=${newTodoCard.taskList[i].id} id="index ${i}"/>
        <p>${newTodoCard.taskList[i].content}</p>
      </li>
      `
  } return taskListIteration;
}

// ${iterateThruTasks(newTodoCard)}