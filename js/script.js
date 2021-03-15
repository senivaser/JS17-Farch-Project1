'use strict';

class ToDo {

  constructor(form, input, todoList, todoCompleted, todoContainer, todoNotifications){

    this.form = document.querySelector(form)
    this.input = document.querySelector(input)
    this.todoList = document.querySelector(todoList)
    this.todoCompleted = document.querySelector(todoCompleted)
    this.todoContainer = document.querySelector(todoContainer) // Контейнер для всех todo в верстке
    this.todoNotifications = document.querySelector(todoNotifications) // Контейнер для сообщений

    this.todoData = new Map(JSON.parse(localStorage.getItem('todoData')) || []);
    console.log(this)
  }

  generateKey() {

    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);4

  }

  updateStorage() {

    localStorage.setItem('todoData', JSON.stringify([...this.todoData]));

  }

  render() {

    this.todoCompleted.textContent = ''
    this.todoList.textContent = ''
    this.todoData.forEach(this.createItem)
    this.updateStorage();
    this.removeNotifications();
    console.log(this.todoData)
  
  }

  createItem = (todo) => {

    const li = document.createElement('li')
    li.classList.add('todo-item')
    li.id = todo.key
    li.insertAdjacentHTML('beforeend',
    `
      <span class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div> 
    `)
  
    if (todo.moving) {

      const dLi = li.cloneNode(true);
      dLi.id += 'dp'
      li.classList.toggle('d-0');
      dLi.classList.toggle('d-1')
      
      const move = () => {
        li.classList.toggle('d-0');
        li.classList.toggle('d-1');
        dLi.classList.toggle('d-0');
        dLi.classList.toggle('d-1');
        setTimeout(() => {
          dLi.remove() = 'none'
        }, 500)
      }

      if (todo.completed) {
        this.todoList.append(dLi);
        this.todoCompleted.append(li);
        move()
      } else {
        this.todoCompleted.append(dLi);
        this.todoList.append(li);
        move()
      }
      todo.moving = false
    } else {
      if (todo.completed) {
        this.todoCompleted.append(li)
      } else {
        this.todoList.append(li)
      }
    }

   
  
  }

  addTodo(event) {

    event.preventDefault();

    if (this.input.value && this.input.value.trim().length) {
      
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
        moving: false
      };            
      
      this.todoData.set(newTodo.key, newTodo);
      this.render();
      console.log(newTodo.completed.opposite())
    } else {
      console.log('render')
      this.render();
      this.setNotification('Ввод не может быть пустым', 'todo-error');
    }
   
  }
  
  completeTodo(key) {

    this.todoData.get(key).completed = !this.todoData.get(key).completed
    this.todoData.get(key).moving = true
    this.render();

  }

  deleteTodo(key, todoN) {

    this.todoData.delete(key)
    this.render();

  }

  setNotification(text, typeSelector) {
    const notification = document.createElement('div')
    notification.classList.add(typeSelector)
    notification.insertAdjacentHTML('beforeend', 
    `
      <span class="text-todo">${text}</span>
    `)
    this.todoNotifications.append(notification)
    
  }

  removeNotifications() {
    
    this.todoNotifications.textContent = ''

  }

  handler() {

    this.todoContainer.addEventListener('click', (event) => {
      
      console.log('here')

      const target = event.target
      const itemN = target.closest('.todo-item')
      const id = (itemN) ? itemN.id : null
      
      if (target.closest('.todo-remove')) {
        this.deleteTodo(id, '.todo-item')
      } else if (target.closest('.todo-complete')) {
        this.completeTodo(id, '.todo-item')
      } else if (target.closest('.todo-edit')) {
        
      }

    })

  }

  

  init(){
  
    this.form.addEventListener('submit', this.addTodo.bind(this))
    this.render();
    this.handler();

  }
}

const todo = new ToDo(
  '.todo-control',
  '.header-input',
  '.todo-list',
  '.todo-completed',
  '.todo-container',
  '.todo-notifications'
);

todo.init();