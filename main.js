let todos = JSON.parse(localStorage.getItem('todos')) || [];

const todoInput = document.getElementById('todoInput');
const todoCategory = document.getElementById('todoCategory');
const todoPriority = document.getElementById('todoPriority');
const todoDueDate = document.getElementById('todoDueDate');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priorityFilter = document.getElementById('priorityFilter');
const deleteCompleted = document.getElementById('deleteCompleted');
const markAllComplete = document.getElementById('markAllComplete');
const sortDueDate = document.getElementById('sortDueDate');
const sortPriority = document.getElementById('sortPriority');

// Set minimum date to today for the due date input
todoDueDate.min = new Date().toISOString().split('T')[0];

// Event Listeners
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});
searchInput.addEventListener('input', filterTodos);
categoryFilter.addEventListener('change', filterTodos);
priorityFilter.addEventListener('change', filterTodos);
deleteCompleted.addEventListener('click', deleteCompletedTodos);
markAllComplete.addEventListener('click', markAllTodosComplete);
sortDueDate.addEventListener('click', () => sortTodos('dueDate'));
sortPriority.addEventListener('click', () => sortTodos('priority'));

function addTodo() {
  const todoText = todoInput.value.trim();
  
  if (todoText !== '') {
    const todo = {
      id: Date.now(),
      text: todoText,
      completed: false,
      category: todoCategory.value,
      priority: todoPriority.value,
      dueDate: todoDueDate.value,
      createdAt: new Date().toLocaleString()
    };
    
    todos.push(todo);
    saveTodos();
    renderTodos();
    resetInputs();
  }
}

function resetInputs() {
  todoInput.value = '';
  todoCategory.value = 'work';
  todoPriority.value = 'low';
  todoDueDate.value = '';
}

function toggleTodo(id) {
  todos = todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

function deleteCompletedTodos() {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
}

function markAllTodosComplete() {
  todos = todos.map(todo => ({ ...todo, completed: true }));
  saveTodos();
  renderTodos();
}

function sortTodos(criteria) {
  switch(criteria) {
    case 'dueDate':
      todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case 'priority':
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      todos.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
      break;
  }
  renderTodos();
}

function filterTodos() {
  const searchTerm = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const priorityValue = priorityFilter.value;
  
  let filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm);
    const matchesCategory = categoryValue === 'all' || todo.category === categoryValue;
    const matchesPriority = priorityValue === 'all' || todo.priority === priorityValue;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });
  
  renderTodoList(filteredTodos);
}

function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
}

function renderTodoList(todosToRender) {
  todoList.innerHTML = '';
  
  todosToRender.forEach(todo => {
    const li = document.createElement('li');
    li.className = `priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
    
    const dueDateText = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date';
    const isTaskOverdue = isOverdue(todo.dueDate);
    
    li.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
        <div class="todo-info">
          <span class="todo-text">${todo.text}</span>
          <span class="todo-meta">
            <span class="tag ${todo.category}">${todo.category}</span>
            <span class="priority">Priority: ${todo.priority}</span>
            <span class="due-date ${isTaskOverdue ? 'overdue' : ''}">
              Due: ${dueDateText}
            </span>
            <span class="created-at">Created: ${todo.createdAt}</span>
          </span>
        </div>
      </div>
      <button class="delete-btn">Delete</button>
    `;
    
    const checkbox = li.querySelector('input');
    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    todoList.appendChild(li);
  });
}

function renderTodos() {
  renderTodoList(todos);
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Initial render
renderTodos();
