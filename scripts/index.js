'use-strict'

import instances from './instances.js'
import server from './LSServer.js'

const app = server()


const {
  LoginBlock,
  RegisterBlock,
  LogOutBlock,
  Form
} = {...instances}

const render = (message) => {
  console.log(message)
  const authData = app.getAuthData()
  if (message) errorBlock.textContent = ''
  contentBlock.textContent = ''
  const [isAuth, user, userData] = [
    authData.auth.isAuth,
    authData.auth.user,
    authData.userData
  ]
  
  if (message && message[1] !== 'console') {
    console.log(message)
    const errorMessage = document.createElement('div')
    errorMessage.setAttribute('class', message[1])
    errorMessage.innerText = message[0]
    errorBlock.append(errorMessage)
  }

  if (isAuth) {
    console.log(loginBlock)
    form.changeBlock(logoutBlock, loginBlock)
    form.chooseBlock(logoutBlock)    
    contentBlock.innerHTML = `<p>Текущий пользователь: ${user}</p><p></p><p>Зарегистрированные пользователи: </p>`
    userData.forEach(user => {
      const userP = document.createElement('p')
      userP.innerHTML = `<p>${user.name} ${user.surname}. Дата регистрации: ${user.dateCreated}</p>`
      contentBlock.append(userP)
    })
  } else {
    if (form.selectedId === 'logout') {
      form.changeBlock(loginBlock, logoutBlock)
      form.chooseBlock(loginBlock)
    }
  }
}

const loginBlock = new LoginBlock()
const loginSwitch = document.getElementById('loginSwitch')
const registerBlock = new RegisterBlock()
const registerSwitch = document.getElementById('registerSwitch')
const logoutBlock = new LogOutBlock()

const form = new Form(app.validator, render)

form.addBlock(loginBlock, loginSwitch)
form.addBlock(registerBlock, registerSwitch)
form.chooseBlock(loginBlock)
loginBlock.setSpeed(1) //Декоративная хрень, не стоящая внимания


const contentBlock = document.createElement('div')
const errorBlock = document.createElement('div')
errorBlock.setAttribute('class', 'm-block')

form.form.after(contentBlock)
form.form.after(errorBlock)

window.addEventListener('load', () => render())

