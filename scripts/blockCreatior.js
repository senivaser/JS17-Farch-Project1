const createElementWithAttr = ([tag, attributes]) => {
  const elem = document.createElement(tag)
  Object.entries(attributes).forEach(([name, value]) => {
    elem.setAttribute(name, value)
  })
  return elem
}

const createInput = (attributes) => {
  return createElementWithAttr(['input', {...attributes, 'required': true}])
}

const lbLoginAttr = {
  'type': 'text',
  'id': 'lbLogin',
  'class': 'fadeIn first',
  'name': 'login',
  'placeholder': 'login',
}

const lbPasswordAttr = {
  'type': 'password',
  'id': 'lbPassword',
  'class': 'fadeIn second',
  'name': 'password',
  'placeholder': 'password'
}

const lbSubmitAttr = {
  'type': 'submit',
  'class': 'fadeIn third',
  'value': 'Log In',
  'id': 'loginSubmit' 
}

const pbLoginAttr = {
  'type': 'text',
  'id': 'pbLogin',
  'class': 'fadeIn first',
  'name': 'login',
  'placeholder': 'login'
}

const pbPasswordAttr = {
  'type': 'password',
  'id': 'lbPassword',
  'class': 'fadeIn second',
  'name': 'password',
  'placeholder': 'password'
}

const pbRePasswordAttr = {
  'type': 'password',
  'id': 'lbRePassword',
  'class': 'fadeIn third',
  'name': 'rePassword',
  'placeholder': 'confirm password'
}

const pbNameAttr = {
  'type': 'text',
  'id': 'rbName',
  'class': 'fadeIn third',
  'name': 'name',
  'placeholder': 'firstname'
}

const pbSurnameAttr = {
  'type': 'text',
  'id': 'rbSurname',
  'class': 'fadeIn third',
  'name': 'surname',
  'placeholder': 'surname'
}

const pbSubmitAttr = {
  'type': 'submit',
  'class': 'fadeIn fourth',
  'value': 'Register',
  'id': 'loginSubmit' 
}

const lobSubmitAttr = {
  'type': 'submit',
  'class': 'fadeIn',
  'value': 'LogOut',
  'id': 'logoutSubmit'
}

const createLoginBlock = () => ([
  createInput(lbLoginAttr),
  createInput(lbPasswordAttr),
  createInput(lbSubmitAttr)
])

const createRegisterBlock = () => ([
  createInput(pbLoginAttr),
  createInput(pbPasswordAttr),
  createInput(pbRePasswordAttr),
  createInput(pbNameAttr),
  createInput(pbSurnameAttr),
  createInput(pbSubmitAttr)

])

const createLogOutBlock = () => ([
  createInput(lobSubmitAttr)
])

export default {
  createLoginBlock,
  createRegisterBlock,
  createLogOutBlock
}