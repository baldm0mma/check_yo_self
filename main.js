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

window.addEventListener('load', onLoad);
// searchInput.addEventListener('input', ???);
// searchButton.addEventListener('click', ????);
// taskTitleInput.addEventListener('input', ????);
// taskItemInput.addEventListener('input', ????);
addTaskItemButton.addEventListener('click', addItemsToArray);
makeTaskListButton.addEventListener('click', onSubmitBtnClick);
clearAll.addEventListener('click', clearEverything);
// filterUrgency.addEventListener('click', ????);
cardArea.addEventListener('click', targetCardUrgent);
listArea.addEventListener('click', deleteSidebarListItem);

function onLoad() {
  repopulateDataAfterReload();
  // buttonDefaultDisable();
}

// function buttonDefaultDisable() {
//   addTaskItemButton.disabled = true;
//   makeTaskListButton.disabled = true;
//   searchButton.disabled = true;
//   filterUrgency.disabled = true;
// }

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
}

function clearInputFields() {
  taskItemInput.value = '';
  taskTitleInput.value = '';
}

function addItemsToArray() {
  if (taskItemInput.value) {
    var newListItem = new Items(taskItemInput.value);
    taskItemsArray.push(newListItem);
    console.log(taskItemsArray);
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
    console.log(taskItemsArray);
    var newTodoCard = new Card(taskTitleInput.value, taskItemsArray);
    console.log(newTodoCard.taskList.length);
    todoCardsArray.push(newTodoCard);
    console.log(todoCardsArray);
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
  console.log(oldTodoCardsArray);
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
  <div class="card-zone__task-card" id="task-card" data-id="${newTodoCard.id}">
    <h3 class="card-zone__task-card__title">${newTodoCard.title}</h3>
    <div class="card-zone__task-card__items">
      <ul class="card-zone__populate">
      ${iterateThruTasks(newTodoCard)}
      </ul>
    </div>
    <div class="card-zone__task-card__footer">
      <div class="card-zone__task-card__footer--left">
        <img class="card-zone__task-card__footer--urgency-button" id="${newTodoCard.urgent}" src="images/urgent.svg">
        <p>URGENT</p>
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

function targetCardUrgent(e) {
  console.log(e.target);
  if (e.target.className === 'card-zone__task-card__footer--left') {
    var card = e.target.closest('.card-zone__task-card');
    console.log(card);
    card.classList.add('urgent');
    var index = findCardIndex(card);
    console.log(index);
    makeCardDataUrgent(index, card);
  }
}

function findCardIndex(card) {
  var cardId = card.dataset.id;
  console.log(cardId);
  return todoCardsArray.findIndex(function(item) {
    return item.id == cardId;
  });
}

function makeCardDataUrgent(index, card) {
  var cardToMakeUrgent = todoCardsArray[index];
  cardToMakeUrgent.updateToDos(index);
  cardToMakeUrgent.saveToStorage();
  updateDomUrgency(index, card);
}

function updateDomUrgency(index, card) {
  if (todoCardsArray[index].urgency) {
    console.log(todoCardsArray[index]);
    card.classList.add('urgent');
  } else {
    card.classList.remove('urgent');
  }
}

// ------------------------------------------------------------------------------------------

// function deleteDisplayedCards(e) {
//   if (e.target.className === "cards__top--right") {
//     var card = e.target.closest('.card');
//     card.remove(); 
//     var index = findCardIndex(card);
//     removeCardData(index);
//     if (document.querySelectorAll('.card').length === 0) {
//       showPrompt();
//     }
//   }
// }

// function findCardIndex(card) {
//   var cardId = card.dataset.id;
//   return ideaCollection.findIndex(function(item) {
//     return item.id == cardId;
//   });
// }

// function removeCardData(index) {
//   var ideaIWanttoDelete = ideaCollection[index];
//   ideaIWanttoDelete.deleteFromStorage(index);
// }

// function editCardBody(e) {
//   var card = e.target.closest('.card');
//   if (e.target.className === 'cards__middle--text') {
//     var bodyText = e.target.innerText;
//     var index = findCardIndex(card);
//     ideaCollection[index].updateBody(bodyText);
//     ideaCollection[index].updateIdea();
//   }
//   if (e.target.className === 'cards__middle--title') {
//     var titleText = e.target.innerText;
//     var index = findCardIndex(card);
//     ideaCollection[index].updateTitle(titleText);
//     ideaCollection[index].updateIdea();
//   }
// }

// function editStar(e) {
//   var card = e.target.closest('.card');
//   if (e.target.className === 'cards__top--left') {
//     var index = findCardIndex(card);
//     ideaCollection[index].updateStar();
//     ideaCollection[index].updateIdea();
//     console.log(e.target);
//     if (e.target.classList.contains('star')) {
//       e.target.classList.remove('star');
//     }
//     if (e.target.classList !== 'star') {
//       e.target.classList.remove('star');
//     }
//   }
// }