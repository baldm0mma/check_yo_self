class Card {
  constructor(title, taskItemsArray, urgent) {
    this.title = title;
    this.taskList = taskItemsArray;
    this.urgent = urgent || false;
    this.id = Date.now();
  }

  saveToStorage() {
    var stringifyData = JSON.stringify(todoCardsArray);
    localStorage.setItem("todos", stringifyData);
  }

  deleteFromStorage() {

  }

  updateToDos() {

  }

  updateTask() {

  } 
}

class Items {
  constructor(content) {
    this.content = content;
    this.done = false;
    this.id = Date.now();
  }
}