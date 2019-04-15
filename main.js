var searchInput = document.querySelector('.header__form__search--input');
var searchButton = document.querySelector('.header__form__search--button');
var taskTitleInput = document.querySelector('.sidebar__form__todo--input');
var taskItemInput = document.querySelector('.sidebar__form__todo--item--input');
var addTaskItemButton = document.querySelector('.sidebar__form__todo__item--button')
var makeTaskListButton = document.querySelector('.sidebar__form__make-task--button');
var clearAll = document.querySelector('.sidebar__form__clear-all--button');
var filterUrgency = document.querySelector('.card-zone__task-card__footer--urgency-button');
var cardArea = document.querySelector('.card-zone');
var listArea = document.querySelector('.sidebar__form--list-items');
var deleteListItemFromSidebar = document.querySelector('.sidebar__insert-list--delete-button');

var taskItemsArray = [];
var todoCardsArray = JSON.parse(localStorage.getItem("todos")) || [];

window.addEventListener('load', onLoad);
// searchInput.addEventListener('input', ???);
// searchButton.addEventListener('click', ????);
// taskTitleInput.addEventListener('input', ????);
// taskItemInput.addEventListener('input', ????);
addTaskItemButton.addEventListener('click', addItemsToArray);
makeTaskListButton.addEventListener('click', onSubmitBtnClick);
clearAll.addEventListener('click', clearEverything);
// filterUrgency.addEventListener('click', ????);
cardArea.addEventListener('click', urgentAndDeleteBtns);
listArea.addEventListener('click', deleteSidebarListItem);

function onLoad() {
  repopulateDataAfterReload();
}

function addListItemToSidebar(newListItem) {
  var listText = `
    <li class="sidebar__insert-list item" data-id="${newListItem.id}" id="">
      <img class="sidebar__insert-list--delete-button item" src="images/delete.svg" alt="Delete task from sidebar list"/>
      <p class="sidebar__insert-list--text item">${newListItem.content}</p>
    </li>`
    listArea.insertAdjacentHTML('beforeend', listText);
  taskItemInput.value = "";
}

function deleteSidebarListItem(e) {
  e.target.closest('li').remove();
}

function findListItemIndex(item) {
  var itemId = item.dataset.id;
  return taskItemsArray.findIndex(function(item) {
    return item.id == itemId;
  });
}

// function removeListItemData(index) {
//   var listItemForDeletion = taskItemsArray[index];
//   listItemForDeletion.splice(index, 1);
// }

function deleteAllListItemInSidebar() {
  var removeLiNodes = document.getElementById('list-items');
  while (removeLiNodes.firstChild) {
    removeLiNodes.removeChild(removeLiNodes.firstChild);
  } 
}

function clearEverything(e) {
  deleteAllListItemInSidebar();
  clearInputFields();
  taskItemsArray = [];
}

function clearInputFields() {
  taskItemInput.value = '';
  taskTitleInput.value = '';
}

function addItemsToArray() {
  if (taskItemInput.value) {

    var newListItem = new Items(taskItemInput.value);
    taskItemsArray.push(newListItem);
    // console.log(taskItemsArray);
    addListItemToSidebar(newListItem);
  } else {
    alert('Please enter a task first!')
  }
}

function onSubmitBtnClick() {
  createTodoCard();
}

function createTodoCard() {
  if (taskTitleInput.value && listArea.innerHTML !== '') {
    // console.log(taskItemsArray);
    var newTodoCard = new Card(taskTitleInput.value, taskItemsArray);
    // console.log(newTodoCard.taskList.length);
    todoCardsArray.push(newTodoCard);
    // console.log(todoCardsArray);
    newTodoCard.saveToStorage();
    appendCardToDOM(newTodoCard);
    deleteAllListItemInSidebar();
    clearInputFields();
  } else {
    alert('Please enter a Title and a few new Tasks for your ToDo list!');
  }
}

function repopulateDataAfterReload() {
  var oldTodoCardsArray = todoCardsArray;
  // console.log(oldTodoCardsArray);
  var newInstances = oldTodoCardsArray.map(function(datum) {
    datum = new Card(datum.title, datum.taskList, datum.urgent, datum.id);
    return datum;
  }); 
  todoCardsArray = newInstances;
  restoreCards(todoCardsArray);
}

function restoreCards(todoCardsArray) {
  todoCardsArray.forEach(function(datum) {
    appendCardToDOM(datum);
  });
}

function appendCardToDOM(newTodoCard) {
  var card = `
  <div class="card-zone__task-card ${newTodoCard.urgent}" id="task-card" data-id="${newTodoCard.id}">
    <h3 class="card-zone__task-card__title">${newTodoCard.title}</h3>
    <div class="card-zone__task-card__items">
      <ul class="card-zone__populate">
      ${iterateThruTasks(newTodoCard)}
      </ul>
    </div>
    <div class="card-zone__task-card__footer">
      <div class="card-zone__task-card__footer--left">
        <img class="card-zone__task-card__footer--urgency-button" id="urgent-img-${newTodoCard.urgent}" src="${newTodoCard.urgentImg}">
        <p id="urgent-text-${newTodoCard.urgent}">URGENT</p>
      </div>
      <div class="card-zone__task-card__footer--right">
        <img class="card-zone__task-card__footer--delete-button" src="images/delete.svg">
        <p>DELETE</p>
      </div>
    </div>
  </div>
  `;
  cardArea.insertAdjacentHTML('afterbegin', card)
  taskItemsArray = [];
}

function iterateThruTasks(newTodoCard) {
  var taskListIteration = '';
  for (var i = 0; i < newTodoCard.taskList.length; i++){
    taskListIteration += `
      <li class="card-zone__populate--li">
        <img class="card__task-delete" src="images/checkbox.svg" alt="Delete task from card" data-id=${newTodoCard.taskList[i].id} id="index ${i}"/>
        <p>${newTodoCard.taskList[i].content}</p>
      </li>
      `
  } return taskListIteration;
}

function urgentAndDeleteBtns(e) {
  if (e.target.className === 'card-zone__task-card__footer--urgency-button') {
    targetCardUrgent(e);
  }
  if (e.target.className === 'card-zone__task-card__footer--delete-button') {
    targetCardDelete(e);
  }
  if (e.target.className === 'card__task-delete') {
    targetListItem(e);
  }
}

function targetCardUrgent(e) {
  var card = e.target.closest('.card-zone__task-card');
  var index = findCardIndex(card);
  makeCardDataUrgent(index);
}

function makeCardDataUrgent(index) {
  var cardToMakeUrgent = todoCardsArray[index];
  cardToMakeUrgent.updateToDos();
  cardToMakeUrgent.saveToStorage();
  cardArea.innerHTML = '';
  repopulateDataAfterReload();
}

function targetCardDelete(e) {
  var card = e.target.closest('.card-zone__task-card');
  var index = findCardIndex(card);
  todoCardsArray[index].deleteFromStorage(index);
  cardArea.innerHTML = '';
  repopulateDataAfterReload();
}

function findCardIndex(card) {
  var cardId = card.dataset.id;
  // console.log(cardId);
  return todoCardsArray.findIndex(function(item) {
    return item.id == cardId;
  });
}

function targetListItem(e) {
  var taskId = e.target.dataset.id;
  // console.log(task);
  var card = e.target.closest('.card-zone__task-card');
  var index = findCardIndex(card);
  var todoObject = todoCardsArray[index];
  var specificTaskIndex = findItemIndex(todoObject, taskId);
  console.log(specificTaskIndex);
  todoObject.updateTask(specificTaskIndex);
  cardArea.innerHTML = '';
  repopulateDataAfterReload();
}

function findItemIndex(todoObject, taskId) {
  return todoObject.taskList.findIndex(function(item) {
    return item.id == taskId;
  });
}

// ------------------------------------------------------------------------------------------