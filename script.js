'use-strict'

const intputN = document.querySelector('#input')

const resulnN = document.querySelector('#result')

let timeout = null

const showValue = () => {

  resulnN.innerText = intputN.value
  
}

intputN.addEventListener('input', (event) => {
  
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(showValue, 300)

})