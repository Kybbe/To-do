const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const listViewBar = document.getElementById('allLists')
const taskViewBar = document.getElementById('todo-list')
const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const listsCounter = document.querySelector('[data-list-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const switchViewBtn = document.getElementById('switchViewBtn')
const taskTemplate = document.getElementById('taskTemplate')
const cover = document.getElementById('cover-todo-list')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')
var opened = false;

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
if(lists[0] == undefined){
    lists = [
        {
            "id": "1628623590818",
            "name": "Groceries (template!)",
            "tasks": [
                {
                    "id": "1628623596258",
                    "name": "Salad",
                    "complete": false
                },
                {
                    "id": "1628623599114",
                    "name": "Tomatoes",
                    "complete": false
                },
                {
                    "id": "1628623626333",
                    "name": "アボカド",
                    "complete": false
                },
                {
                    "id": "1628623643104",
                    "name": "Bread",
                    "complete": true
                },
                {
                    "id": "1628623644836",
                    "name": "Milk",
                    "complete": true
                },
                {
                    "id": "1628623656935",
                    "name": "Eggs (6 pack atleast)",
                    "complete": false
                }
            ]
        }
    ]
    selectedListId = "1628623590818"
}
if (selectedListId == "null") {
    selectedListId = null;
}

if(!currentTheme && userPrefersDark) {
  document.documentElement.setAttribute('data-theme', 'dark');
  toggleSwitch.checked = true;
}

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {        
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
}

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    if(window.innerWidth <= 1000){
        openCloseBar();
    } else if(window.innerWidth >= 1000 && document.getElementsByClassName('opened').length == 1) {
        openCloseBar();
    }
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
  }
})

clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    selectedListId = list.id;
    saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

tasksContainer.addEventListener('click', e => {
    if ($(e.target.parentNode).attr('class') === 'deleteTask') {
        const selectedList = lists.find(list => list.id === selectedListId)
        
        const removeIndex = selectedList.tasks.findIndex( item => item.id == $(e.target.parentNode).attr('id') );
        selectedList.tasks.splice( removeIndex, 1 );

        saveAndRender()
    }
})

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    if(lists.length != 0) {
        selectedListId = lists[lists.length - 1].id
    } else {
        selectedListId = null;
    }
    saveAndRender()
})

switchViewBtn.addEventListener('click', e => {
    openCloseBar();
})

cover.addEventListener('click', e => {
    openCloseBar();
})

function openCloseBar() {
    if(!opened) {
        $(listViewBar).addClass("opened");
        taskViewBar.style.opacity = "0.2"
        cover.style.display = "block"
        
        opened = true;
      } else {
        $(listViewBar).removeClass("opened");
        taskViewBar.style.opacity = "1"
        cover.style.display = "none"
        
        opened = false;
    }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  clearElement(listsContainer)
  renderLists()
  renderListCount()
  const selectedList = lists.find(list => list.id === selectedListId)
  const listsComment = document.getElementById('emptyListsComment')
  let backgroundLines = document.getElementsByClassName("backgroundLines")[0];
  
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
    listsComment.style.display = 'block'
  } else {
      backgroundLines.style.height = `calc(100% - (197px + ${selectedList.tasks.length * 56}px))`;
      if(backgroundLines.offsetHeight < 57) {
        backgroundLines.style.padding = "0px";
      } else {
        backgroundLines.style.padding = "56px 0px 0px 0px";
      }

      listDisplayContainer.style.display = ''
      listsComment.style.display = 'none'
      listTitleElement.innerText = selectedList.name
      renderTaskCount(selectedList)
      clearElement(tasksContainer)
      renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    const deleteButton = taskElement.querySelector('button')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    deleteButton.id = task.id
    tasksContainer.appendChild(taskElement)
  })
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
  renderListCount()
}

function renderListCount() {
    const listCount = lists.length
    const listString = lists.length === 1 ? "list" : "lists"
    listsCounter.innerText = `${listCount} ${listString}`
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

toggleSwitch.addEventListener('change', switchTheme, false);

render()