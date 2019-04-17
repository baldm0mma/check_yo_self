
// Global Variables ------------------------------------------------------------------

var addTaskItemButton = document.querySelector('.sidebar__form__todo__item--button');
var cardArea = document.querySelector('.card-zone');
var clearAll = document.querySelector('.sidebar__form__clear-all--button');
var deleteListItemFromSidebar = document.querySelector('.sidebar__insert-list--delete-button');
var listArea = document.querySelector('.sidebar__form--list-items');
var makeTaskListButton = document.querySelector('.sidebar__form__make-task--button');
var prompt = document.querySelector('.card-zone__taskPrompt');
var searchButton = document.querySelector('.header__form__search--button');
var searchInput = document.querySelector('.header__form__search--input');
var taskItemInput = document.querySelector('.sidebar__form__todo--item--input');
var taskTitleInput = document.querySelector('.sidebar__form__todo--input');
var cardTitle = document.getElementsByClassName('card-zone__task-card__title');
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
window.addEventListener('load', onLoad);
searchButton.addEventListener('click', searchFunction);
searchInput.addEventListener('keyup', clearSearch);
urgencyFilterButton.addEventListener('click', verifyUrgentTasks);

// On load functions ------------------------------------------------------------------

function onLoad() {
  repopulateDataAfterReload();
  promptToggle();
}

function promptToggle() {
  if (todoCards.length > 0) {
    prompt.classList.add("hidden");
  } else {
    prompt.classList.remove("hidden");
  }
}

// Sidebar functions ------------------------------------------------------------------

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
  if (taskItemInput.value) {
    var newListItem = new Items(taskItemInput.value);
    taskItems.push(newListItem);
    addListItemToSidebar(newListItem);
  } else {
    alert('Please enter a task first!')
  }
}

// On sidebar button click population functions ------------------------------------------------------

function onSubmitBtnClick() {
  createTodoCard();
  promptToggle();
}

function createTodoCard() {
  if (taskTitleInput.value && listArea.innerText !== '') {
    var newTodoCard = new Card(taskTitleInput.value, taskItems);
    todoCards.push(newTodoCard);
    newTodoCard.saveToStorage();
    appendCardToDOM(newTodoCard);
    deleteAllSidebarListItems();
    clearInputFields();
  } else {
    alert('Please enter a Title and a few new Tasks for your ToDo list!');
  }
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
  taskItems = [];
}

function appendTaskToCard(newTodoCard) {
  var taskListIteration = '';
  for (var i = 0; i < newTodoCard.taskList.length; i++){
    taskListIteration += `
      <li class="card-zone__populate--li">
        <img class="card__task-delete" src=${newTodoCard.taskList[i].doneImg} alt="Delete task from card" data-id=${newTodoCard.taskList[i].id} id="index ${i}"/>
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
  promptToggle();
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
}

function clearInputFields() {
  taskItemInput.value = '';
  taskTitleInput.value = '';
}

// Search functions ------------------------------------------------------------------------

function searchFunction() {
  // debugger;
  var searchQuery = searchInput.value.toUpperCase();
  console.log(searchQuery)
  for (i = 0; i < cardTitle.length; i++) {
      if (cardTitle[i].textContent.toUpperCase().indexOf(searchQuery) < 0) {
        cardTitle[i].parentNode.style.display = 'none';
    }
  }
}
function clearSearch() {
  if(searchInput.value == '') {
    cardArea.innerHTML = '';
    repopulateDataAfterReload();
  }
}

// Filter by urgent functions ---- Not functioning, but want to keep for later ---------------

// function verifyUrgentTasks() {
//   // debugger;
//   var totalOfUrgents = 0;
//   todoCards.map(function(item) {
//     item.urgent === true ? totalOfUrgents++ : null;
//   })
//   runUrgencyFilterValue(totalOfUrgents)
// }
// function runUrgencyFilterValue(totalOfUrgents) {
//   totalOfUrgents > 0 ? urgencyFilterValue() : null;
// }

// function urgencyFilterValue() {
//   var dataUrgency = urgencyFilterButton.dataset;
//   if (dataUrgency.value == "false") {
//     dataUrgency.value = "true";
//     urgencyFilter()
//   } else {
//     dataUrgency.value = "false";
//     // cardArea.innerHTML = '';
//     repopulateDataAfterReload();
//   }
// }
// function urgencyFilter() {  
//   var filteredArray = [];
//   todoCards.map(function(item) {
//     (item.urgent == true) ? filteredArray.push(item) : null;   
//   })
//   // cardArea.innerHTML = '';
//   repopulateDataAfterReload();
// }