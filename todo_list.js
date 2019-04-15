class Card {
  constructor(title, taskItemsArray, urgent, id) {
    this.title = title;
    this.taskList = taskItemsArray;
    this.urgent = urgent || false;
    this.id = id || Date.now();
  }

  saveToStorage() {
    var stringifyData = JSON.stringify(todoCardsArray);
    localStorage.setItem("todos", stringifyData);
  }

  deleteFromStorage(index) {
    todoCardsArray.splice(index, 1);
    this.saveToStorage(); 
  }

  updateToDos() {
    this.urgent = !this.urgent;
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