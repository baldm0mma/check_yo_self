class listCard {
  constructor(title, taskList) {
    this.title = title;
    this.taskList = taskList;
    this.urgent = false;
    this.id = Date.now();
  }

  saveToStorage() {
    var stringifyData = JSON.stringify(todoCards);
    localStorage.setItem("todos", stringifyData);
  }

  deleteFromStorage() {

  }

  updateToDos() {

  }

  updateTask() {

  } 
}

class items {
  constructor(content) {
    this.content = content;
    this.done = false;
    this.id = Date.now();
  }
}