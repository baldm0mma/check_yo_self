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

  deleteFromStorage() {

  }

  updateToDos(index) {
    todoCardsArray[index].urgent = true;
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