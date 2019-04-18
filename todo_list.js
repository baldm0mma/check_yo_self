class Card {
  constructor(title, taskItems, urgent, id) {
    this.title = title;
    this.taskList = taskItems;
    this.urgent = urgent || false;
    this.id = id || Date.now();
  }

  saveToStorage() { 
    var stringifyData = JSON.stringify(todoCards);
    localStorage.setItem("todos", stringifyData);
  }

  deleteFromStorage(index) {
    todoCards.splice(index, 1);
    this.saveToStorage();
  }

  updateToDos() {
    this.urgent = !this.urgent; 
    this.saveToStorage();
  }

  updateTask(index) {
    this.taskList[index].done = !this.taskList[index].done;
    this.saveToStorage(); 
  }  
}

class Items {
  constructor(content) {
    this.content = content;
    this.done = false;
    this.id = Date.now();
    this.doneImg;
  }
}