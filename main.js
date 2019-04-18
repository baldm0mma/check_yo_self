
// Global Variables ------------------------------------------------------------------

var addTaskItemButton = document.querySelector('.sidebar__form__todo__item--button');
var cardArea = document.querySelector('.card-zone');
var cardTitle = document.getElementsByClassName('card-zone__task-card__title');
var clearAll = document.querySelector('.sidebar__form__clear-all--button');
var deleteListItemFromSidebar = document.querySelector('.sidebar__insert-list--delete-button');
var listArea = document.querySelector('.sidebar__form--list-items');
var makeTaskListButton = document.querySelector('.sidebar__form__make-task--button');
var prompt = document.querySelector('.card-zone__taskPrompt');
var searchInput = document.querySelector('.header__form__search--input');
var taskItemInput = document.querySelector('.sidebar__form__todo--item--input');
var taskTitleInput = document.querySelector('.sidebar__form__todo--input');
var urgencyFilterButton = document.querySelector('.sidebar__form__urgency--button');

// Global Arrays ------------------------------------------------------------------

var taskItems = [];
var todoCards = JSON.parse(localStorage.getItem("todos")) || [];

// Event Listeners ------------------------------------------------------------------

addTaskItemButton.addEventListener('click', addItemsToArray);
cardArea.addEventListener('click', targetCardButtons);
clearAll.addEventListener('click', clearEverything);
listArea.addEventListener('click', deleteSingleSidebarListItem);
makeTaskListButton.addEventListener('click', onSubmitBtnClick);
searchInput.addEventListener('keyup', searchFunction);
taskItemInput.addEventListener('input', enableDisableButtons);
taskTitleInput.addEventListener('input', enableDisableButtons);
urgencyFilterButton.addEventListener('click', urgencyFilterValue);
window.addEventListener('load', onLoad);


// On load functions ------------------------------------------------------------------

function onLoad() {
  repopulateDataAfterReload();
  promptToggle();
  enableDisableButtons();
}

function promptToggle() {
  todoCards.length < 1 ? 
    prompt.classList.remove("hidden") : 
    prompt.classList.add("hidden");
}

// Sidebar functions ------------------------------------------------------------------

function enableDisableButtons() {
  taskItemInput.value == '' ? 
    addTaskItemButton.disabled = true : 
    addTaskItemButton.disabled = false;
  taskTitleInput.value == '' || listArea.innerHTML == '' ? 
    makeTaskListButton.disabled = true : 
    makeTaskListButton.disabled = false;
  taskItemInput.value == '' && taskTitleInput.value == '' && listArea.innerText == '' ? 
    clearAll.disabled = true : 
    clearAll.disabled = false;
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

function deleteSingleSidebarListItem(e) {
  e.target.closest('li').remove();
}

function deleteAllSidebarListItems() {
  var removeLiNodes = document.getElementById('list-items');
  while (removeLiNodes.firstChild) {
    removeLiNodes.removeChild(removeLiNodes.firstChild);
  } 
}

function addItemsToArray() {
  var newListItem = new Items(taskItemInput.value);
  taskItems.push(newListItem);
  addListItemToSidebar(newListItem);
  enableDisableButtons();
}

// On sidebar button click population functions ------------------------------------------------------

function onSubmitBtnClick() {
  createTodoCard();
  promptToggle();
  enableDisableButtons();
}

function createTodoCard() {
  var newTodoCard = new Card(taskTitleInput.value, taskItems);
  todoCards.push(newTodoCard);
  newTodoCard.saveToStorage();
  appendCardToDOM(newTodoCard);
  deleteAllSidebarListItems();
  clearInputFields();
}

function appendCardToDOM(newTodoCard) {
  var card = `
  <div class="card-zone__task-card ${newTodoCard.urgent}" id="task-card" data-id="${newTodoCard.id}">
    <h3 class="card-zone__task-card__title ${newTodoCard.urgent}">${newTodoCard.title}</h3>
    <div class="card-zone__task-card__items ${newTodoCard.urgent}">
      <ul class="card-zone__populate">
      ${appendTaskToCard(newTodoCard)}
      </ul>
    </div>
    <div class="card-zone__task-card__footer">
      <div class="card-zone__task-card__footer--left">
        <img class="card-zone__task-card__footer--urgency-button" id="urgent-img-${newTodoCard.urgent}" src="${newTodoCard.urgent ? 'images/urgent-active.svg' : 'images/urgent.svg'}">
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
  taskItems = [];
}

function appendTaskToCard(newTodoCard) {
  var taskListIteration = '';
  for (var i = 0; i < newTodoCard.taskList.length; i++){
    taskListIteration += `
      <li class="card-zone__populate--li">
        <img class="card__task-delete" src=${newTodoCard.taskList[i].done ? 'images/checkbox-active.svg' : 'images/checkbox.svg'} alt="Delete task from card" data-id=${newTodoCard.taskList[i].id} id="index ${i}"/>
        <p id="check-off-${newTodoCard.taskList[i].done}">${newTodoCard.taskList[i].content}</p>
      </li>
      `
  } return taskListIteration;
}

function repopulateDataAfterReload() {
  var oldTodoCards = todoCards;
  var newInstances = oldTodoCards.map(function(datum) {
    datum = new Card(datum.title, datum.taskList, datum.urgent, datum.id);
    return datum;
  }); 
  todoCards = newInstances;
  restoreCards(todoCards);
}

function restoreCards(todoCards) {
  todoCards.forEach(function(datum) {
    appendCardToDOM(datum);
  });
}

// Target card buttons functions ----------------------------------------------------------------

function targetCardButtons(e) {
  if (e.target.className === 'card-zone__task-card__footer--urgency-button') {
    targetCardUrgent(e);
  }
  if (e.target.className === 'card-zone__task-card__footer--delete-button') {
    targetCardForDeletion(e);
  }
  if (e.target.className === 'card__task-delete') {
    targetListItem(e);
  }
  promptToggle();
}

function targetCardUrgent(e) {
  var card = e.target.closest('.card-zone__task-card');
  var index = findCardIndex(card);
  makeCardDataUrgent(index);
}

function makeCardDataUrgent(index) {
  var cardToMakeUrgent = todoCards[index];
  cardToMakeUrgent.updateToDos();
  cardArea.innerHTML = '';
  repopulateDataAfterReload();
}

function targetCardForDeletion(e) {
  var card = e.target.closest('.card-zone__task-card');
  var index = findCardIndex(card);
  activateDeleteBtn(index);
}

function activateDeleteBtn(index) {
  var deleteObj = todoCards[index].taskList;
  var newArray = deleteObj.filter(function(el) {
    return el.done === true;
  });
  if (newArray.length === deleteObj.length) {
    deleteCardData(index);
  } else {
    alert('Please complete all tasks before deleting ToDo list! - You can do it!')
  }
}

function deleteCardData(index) {
  todoCards[index].deleteFromStorage(index);
  cardArea.innerHTML = '';
  repopulateDataAfterReload();
}

function findCardIndex(card) {
  var cardId = card.dataset.id;
  return todoCards.findIndex(function(item) {
    return item.id == cardId;
  });
}

function targetListItem(e) {
  var taskId = e.target.dataset.id;
  var card = e.target.closest('.card-zone__task-card');
  var index = findCardIndex(card);
  var todoObject = todoCards[index];
  var specificTaskIndex = findItemIndex(todoObject, taskId);
  todoObject.updateTask(specificTaskIndex);
  todoObject.saveToStorage();
  cardArea.innerHTML = '';
  repopulateDataAfterReload();
}

function findItemIndex(todoObject, taskId) {
  return todoObject.taskList.findIndex(function(item) {
    return item.id == taskId;
  });
}

// Global clearing functions ----------------------------------------------------------------

function clearEverything(e) {
  deleteAllSidebarListItems();
  clearInputFields();
  taskItems = [];
  enableDisableButtons();
}

function clearInputFields() {
  taskItemInput.value = '';
  taskTitleInput.value = '';
}

// Search functions ------------------------------------------------------------------------

function searchFunction() {
  var searchQuery = searchInput.value.toLowerCase();
  console.log(searchQuery)
  for (i = 0; i < cardTitle.length; i++) {
      if (cardTitle[i].textContent.toLowerCase().indexOf(searchQuery) < 0) {
        cardTitle[i].parentNode.style.display = 'none';
    }
    clearSearch();
  }
}

function clearSearch() {
  if(searchInput.value == '') {
    cardArea.innerHTML = '';
    repopulateDataAfterReload();
  }
}

// Filter by urgent functions -----------------------------------------------------------------

function urgencyFilterValue() {
  var dataUrgency = urgencyFilterButton.dataset;
  if (dataUrgency.urgency == 'false') {
    dataUrgency.urgency = true;
    urgencyFilterButton.classList.add('true');
    urgencyFilter();
  } else {
    dataUrgency.urgency = false;
    cardArea.innerHTML = '';
    restoreCards(todoCards);
    urgencyFilterButton.classList.remove('true');
  }
}

function urgencyFilter() {  
  var filteredArray = [];
  todoCards.map(function(item) {
    (item.urgent == true) ? filteredArray.push(item) : null;   
  });
  cardArea.innerHTML = '';
  restoreCards(filteredArray);
}