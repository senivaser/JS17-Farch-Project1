'use strict';

class ToDo {

  constructor(form, input, todoList, todoCompleted, todoContainer, todoNotifications){

    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoContainer = document.querySelector(todoContainer); // Контейнер для всех todo в верстке
    this.todoNotifications = document.querySelector(todoNotifications); // Контейнер для сообщений

    this.todoData = new Map(JSON.parse(localStorage.getItem('todoData')) || []);
    //console.log(this)
  }

  //#region utils
  generateKey() {

    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  }
  //#endregion utils
  

  //#region localStorage
  updateStorage() {


    localStorage.setItem('todoData', JSON.stringify([...this.todoData]));

  }
  //#endregion localStorage


  //#region render
  render() {

    //Затираем списки и ввод
    this.input.value = ''
    this.todoCompleted.textContent = ''; 
    this.todoList.textContent = '';

    //Заполняем списки
    this.todoData.forEach(this.createItem);

    //Обновляем базу данных
    this.updateStorage(); 

    //Удаляем предупреждения, так как рендер удачный
    this.removeNotifications();
  
  }

  createItem = (todo) => {

    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.id = todo.key;
    li.insertAdjacentHTML('beforeend',
    `
      <span contenteditable="${todo.isContenteditable}" class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div> 
    `);
    
    //Если свойство isMoving есть true, то дело(todo) собирается изменить статус
    if (todo.isMoving) {

      //Создаем клон-ноду, которая будет исчезать, меняем ей id
      const dLi = li.cloneNode(true);
      dLi.id += 'dp';

      //До того, как мы добавим ноды в DOM дерево сделаем исчезающаю ноду видимой (.d-1),
      // а появляющуюся невидимой (.d-0)
      li.classList.toggle('d-0');
      dLi.classList.toggle('d-1');
      
      //При движении меняем видимость через классы, анимация смены классов в есть css, 
      //после изменения классов, невидимый исчезнувший элемент удаляем из DOM-дерева
       const move = () => {

        li.classList.toggle('d-0');
        li.classList.toggle('d-1');
        dLi.classList.toggle('d-0');
        dLi.classList.toggle('d-1');

        setTimeout(() => {
          dLi.remove()
        }, 500)

      }

      //В зависимости от того, сделано ли дело, добавляем изчезающий и появляющийся элемент в соотвествующие списки
      if (todo.completed) {

        this.todoList.append(dLi);  //будет исчезать из todoList
        this.todoCompleted.append(li); //будет появляться в todoCompleted
        move(); //Исчезновение и появление

      } else {

        this.todoCompleted.append(dLi); //будет исчезать из todoCompleted
        this.todoList.append(li); //будет появляться в todoList
        move(); //Исчезновение и появление

      }
      
      //Лишаем todo возможности рендерить движение до следующей инициализации 
      todo.isMoving = false

    } else {
      
      //Здесь все как обычно
      if (todo.completed) {
        this.todoCompleted.append(li);
      } else {
        this.todoList.append(li);
      }

    }

   
  
  }
  //#endregion render


  //#region notifications rendering
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
  //#endregion notifications rendering


  //#region todoLogic
  addTodo(event) {

    event.preventDefault();

    if (this.input.value && this.input.value.trim().length) {
      
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
        isMoving: false, //свойство для движения в списке
      };            
      
      this.todoData.set(newTodo.key, newTodo);
      this.render();
    } else {
      this.render();
      this.setNotification('Ввод не может быть пустым', 'todo-error'); //Сообщение о некорректном вводе появляется после рендера
    }
   
  }
  
  completeTodo(key) {

    this.todoData.get(key).completed = !this.todoData.get(key).completed
    this.todoData.get(key).isMoving = true //инициируем движение дела в рендере
    this.render();

  }

  deleteTodo(key) {

    this.todoData.delete(key)
    this.render();

  }

  handleEditTodo(key, node) {
   
    if (node.isContentEditable) {

      this.todoData.get(key).value = node.innerText

      node.contentEditable = false  

      this.render();

    } else {

      node.contentEditable = true

    }
  }
  //#endregion todoLogic


  //#region handling
  handler() {

    this.todoContainer.addEventListener('click', (event) => {
      
      //console.log('here')

      const target = event.target
      const itemN = target.closest('.todo-item')
      const id = (itemN) ? itemN.id : null
      
      if (target.closest('.todo-remove')) {
        this.deleteTodo(id)
      } else if (target.closest('.todo-complete')) {
        this.completeTodo(id)
      } else if (target.closest('.todo-edit')) {
        this.handleEditTodo(id, itemN.querySelector('span')) 
      }

    })

  }
  //#endregion handling
  

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