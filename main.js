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
makeTaskListButton.addEventListener('click', onSubmitBtnClick);
clearAll.addEventListener('click', clearEverything);
// filterUrgency.addEventListener('click', ????);
// cardArea.addEventListener('click', ????);
listArea.addEventListener('click', deleteSidebarListItem);

function onLoad() {
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

function removeListItemData(index) {
  var listItemForDeletion = taskItemsArray[index];
  listItemForDeletion.splice(index, 1);
}

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
  }
}

function onSubmitBtnClick() {
  createTodo(taskItemsArray);
}

function createTodo(taskItemsArray) {
  if (taskTitleInput.value && listArea.innerHTML === !'') {
    console.log(taskItemsArray);
    var newTodoCard = new Card(taskTitleInput.value, taskItemsArray);
    console.log(newTodoCard.taskList.length);
    todoCardsArray.push(newTodoCard);
    console.log(todoCardsArray);
    newTodoCard.saveToStorage();
    appendCardToDOM(newTodoCard);
    deleteAllListItemInSidebar();
    clearInputFields();
    taskItemsArray = [];
  }
}


function appendCardToDOM(newTodoCard) {
  var card = `
  <div class="card-zone__task-card" data-id="${newTodoCard.id}">
    <h3 class="card-zone__task-card__title">${newTodoCard.title}</h3>
    <div class="card-zone__task-card__items">
      <ul class="card-zone__populate">
      ${iterateThruTasks(newTodoCard)}
      </ul>
    </div>
    <div class="card-zone__task-card__footer">
      <div class="card-zone__task-card__footer left">
        <img class="card-zone__task-card__footer--urgency-button" id="${newTodoCard.urgent}" src="images/urgent.svg">
        <p>URGENT</p>
      </div>
      <div class="card-zone__task-card__footer right">
        <img class="card-zone__task-card__footer--delete-button" src="images/delete.svg">
        <p>DELETE</p>
      </div>
    </div>
  </div>
  `;
  cardArea.insertAdjacentHTML('afterbegin', card)
}

function iterateThruTasks(newTodoCard) {
  var taskListIteration = '';
  for (var i = 0; i < newTodoCard.taskList.length; i++){
    taskListIteration += `
      <li>
        <input type="checkbox" data-id=${newTodoCard.taskList[i].id} id="index ${i}"/>
        <p>${newTodoCard.taskList[i].content}</p>
      </li>
      `
  } return taskListIteration;
}

// ------------------------------------------------------------------------------------------

function restoreMethods() {
  var oldCollection = ideaCollection;
  var newInstances = oldCollection.map(function(datum) {
    datum = new Idea (datum.id, datum.title, datum.body, datum.star, datum.quality);
    return datum;
  }); 
  ideaCollection = newInstances;
  restoreCards(ideaCollection);
}

function restoreCards(ideaCollection) {
  ideaCollection.forEach(function(datum) {
    displayIdeas(datum);
  });
}

function displayIdeas(ideaInstance) {
  var ideaCard = `
    <div class="card" data-id="${ideaInstance.id}">
        <section class="cards__top card--section">
          <div class="cards__top--left" alt="star-rating"></div>
          <div class="cards__top--right" alt="delete-X"></div>
        </section>
        <section class="cards__middle card--section">
          <h3 class="cards__middle--title" id="editable-title" contenteditable="true">${ideaInstance.title}</h3>
          <p class="cards__middle--text" id="editable-body" contenteditable="true">${ideaInstance.body}</p>
        </section>
        <section class="cards__bottom card--section">
          <img class="cards__bottom--left" src="images/upvote.svg">
          <p class="cards__bottom--text">Quality: ${ideaInstance.quality}</p>
          <img class="cards__bottom--right" src="images/downvote.svg">
        </section>
      </div>`;
  cardTable.insertAdjacentHTML('afterbegin', ideaCard)
  hidePrompt();
}