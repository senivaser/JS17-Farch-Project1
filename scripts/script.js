'use-strict'

const todoControlN = document.querySelector('.todo-control');
const headerInputN = document.querySelector('.header-input');
const todoListN = document.querySelector('.todo-list');
const todoCompletedN = document.querySelector('.todo-completed');

const render = function () {

  todoListN.textContent = '';
  todoCompletedN.textContent = '';
  headerInputN.value = ''; //12.1.4 Очистка строки ввода
  localStorage.setItem('todoData', JSON.stringify(todoData)); //12.1.6

  todoData.forEach((item, index, arr) => {

    const newTodoN = document.createElement('li');
    newTodoN.classList.add('todo-item');
    
    if (item.value) {                                   //12.1.3 Проверка на пустоту
      newTodoN.innerHTML = 
      `<span class="text-todo">${item.value}</span>` +
      '<div class="todo-buttons">' +
        `<button class="todo-remove"></button>` +
        `<button class="todo-complete"></button>` +
      '</div>';
  
      if (item.completed) {
        todoCompletedN.append(newTodoN);
      }
      else {
        todoListN.append(newTodoN);
      }  

      //#region Перемещение по признаку выполнения || 12.1.2
      const btnTodoCompleteN = newTodoN.querySelector('.todo-complete');

      btnTodoCompleteN.addEventListener('click', function(e){

        item.completed = !item.completed;
        render();

      });
      //#endregion Перемещение по признаку выполнения

      //#region Удаление по кнопке || 12.1.5
      const btnTodoRemoveN = newTodoN.querySelector('.todo-remove');

      btnTodoRemoveN.addEventListener('click', function(e){

        arr.splice(index, 1)
        render();

      });
      //#endregion Удаление по кнопке
    };
  
  });
  
  

};

//#region Добавление по Enter и + || 12.1.1

const addTodo = function (e) {
  
  e.preventDefault();

  const newTodo = {
    value: headerInputN.value,
    completed: false
  };
  
  if (newTodo.value.trim().length) todoData.push(newTodo);


  render();
};


todoControlN.addEventListener('submit', addTodo);

document.addEventListener('keypress', (e) => {
  if (e.key === 'enter') addTodo(e);
});
//#endregion Добавление по Enter и +

let todoData = JSON.parse(localStorage.getItem('todoData')) || []; //12.1.7
render();
