import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

const toDoList = new ToDoList();

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  processSubmission();

  const clearItems = document.getElementById("clearItems");
  clearItems.addEventListener("click", (event) => {
    console.log("clicked");
    const list = toDoList.getList();
    if (list.length) {
      const confirmed = confirm("Are you sure you want to clear?");
      if (confirmed) {
        toDoList.clearList();
        updatePersistentData(toDoList.getList());
        refreshPage();
      }
    }
  });

  loadListObject();
  refreshPage();
};

const loadListObject = () => {
  const storedList = localStorage.getItem("myToDoList");
  if (typeof storedList !== "string") return;
  const parsedList = JSON.parse(storedList);
  parsedList.forEach((itemObj) => {
    const newToDoItem = createNewItem(itemObj._id, itemObj._item);
    toDoList.addItemToList(newToDoItem);
  });
};

const refreshPage = () => {
  clearListDisplay();
  renderList();
  clearEntry();
  setFocusOnEntry();
};

const clearListDisplay = () => {
  const parentElement = document.getElementById("listItems");
  deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
  while (parentElement.lastElementChild) {
    parentElement.removeChild(parentElement.lastElementChild);
  }
};

const renderList = () => {
  const list = toDoList.getList();
  list.forEach((item) => {
    buildListItem(item);
  });
};

const buildListItem = (item) => {
  const div = document.createElement("div");
  div.className = "item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = item.getId();
  checkbox.tabIndex = 0;
  addClickListenerToCheckbox(checkbox);

  const label = document.createElement("label");
  label.htmlFor = item.getId();
  label.textContent = item.getItem();

  div.appendChild(checkbox);
  div.appendChild(label);

  document.getElementById("listItems").appendChild(div);
};

const addClickListenerToCheckbox = (checkbox) => {
  checkbox.addEventListener("click", (event) => {
    toDoList.removeItemFromList(checkbox.id);
    const removedText = document.getElementById(checkbox.id).nextElementSibling
      .textContent;
    updatePersistentData(toDoList.getList());
    updateScreenReaderConfirmation(removedText, "removed");
    setTimeout(() => {
      refreshPage();
    }, 500);
  });
};

const updatePersistentData = (listArray) => {
  localStorage.setItem("myToDoList", JSON.stringify(listArray));
};

const clearEntry = () => {
  document.getElementById("newItem").value = "";
};

const setFocusOnEntry = () => {
  document.getElementById("newItem").focus();
};

const processSubmission = () => {
  const itemEntryForm = document.getElementById("itemEntryForm");
  itemEntryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newEntry = document.getElementById("newItem").value.trim();
    if (!newEntry.length) return;
    const nextItemId = getNextItemId();
    const toDoItem = createNewItem(nextItemId, newEntry);
    toDoList.addItemToList(toDoItem);
    updatePersistentData(toDoList.getList());
    updateScreenReaderConfirmation(newEntry, "added");
    refreshPage();
  });
};

const getNextItemId = () => {
  let nextItemId = 1;
  const list = toDoList.getList();
  if (list.length > 0) {
    nextItemId = list[list.length - 1].getId() + 1;
  }
  return nextItemId;
};

const createNewItem = (itemId, itemText) => {
  const toDo = new ToDoItem();
  toDo.setId(itemId);
  toDo.setItem(itemText);
  return toDo;
};

const updateScreenReaderConfirmation = (newEntry, actionVerb) => {
  document.getElementById(
    "confirmation"
  ).textContent = `${newEntry} ${actionVerb}.`;
};
