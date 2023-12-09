export default class ToDoList {
  constructor() {
    this._list = [];
  }

  getList() {
    return this._list;
  }

  clearList() {
    this._list = [];
  }

  addItemToList(itemObj) {
    this._list.push(itemObj);
  }

  removeItemFromList(id) {
    for (let i = 0; i < this._list.length; i++) {
      if (this._list[i].getId() == id) {
        this._list.splice(i, 1);
        break;
      }
    }
  }
}
