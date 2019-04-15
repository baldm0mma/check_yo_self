class Card {
  constructor(title, taskItemsArray, urgent, id) {
    this.title = title;
    this.taskList = taskItemsArray;
    this.urgent = urgent || false;
    this.id = id || Date.now();
    this.urgentImg;
    this.urgent ? this.urgentImg = 'images/urgent-active.svg' : this.urgentImg = 'images/urgent.svg';
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

  updateTask(index) {
    this.taskList[index].done = !this.taskList[index].done;
    this.taskList[index].done ? 
      this.taskList[index].doneImg = 'images/checkbox-active.svg' : 
      this.taskList[index].doneImg = 'images/checkbox.svg';
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