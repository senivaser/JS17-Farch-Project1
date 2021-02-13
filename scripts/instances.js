import blockCreator from './blockCreatior.js'

const { createLoginBlock,
  createRegisterBlock,
  createLogOutBlock 
} = {...blockCreator}

const speedObj = {
  1: ['fadeIn first', 'fadeIn second', 'fadeIn third'],
  2: ['fadeIn second', 'fadeIn third', 'fadeIn fourth']
}  

class FormBlock {
  constructor() {
    this.elems = []
    this.id = ''
    this.switch = null, 
    this.isSwitchActive = false
  }   

  setSwitchActive() {
    this.switch.isSwitchActive = true
    this.switch.setAttribute('class', 'active')
  }

  setSwitchInactive() {
    this.switch.isSwitchActive = false
    this.switch.setAttribute('class', 'inactive underlineHover')
  }  

  setSwitch(elem, listener) {
    
    this.switch = elem 
    
    this.switch.addEventListener('click', () => {
      listener()
      this.setSwitchActive()
    })
  }

  setEachAttribute([name, value]) {
    this.elems.forEach(elem => elem.setAttribute(name, value))
  }

  // hideAll() {
  //   this.setEachAttribute('style', 'display: none')
  // }

  // showAll() {
  //   this.setEachAttribute('style', 'display: block')
  // }

  getElems() {
    return this.elems
  }

}

class LoginBlock extends FormBlock {
  constructor() {
    super();
    this.elems = createLoginBlock()
    this.speedObj = speedObj
    this.id = 'login'
  }
  
  setSpeed(speed) {
    this.setEachAttribute('class', this.speedObj[speed])
  } 
}

class RegisterBlock extends FormBlock {
  constructor() {
    super();
    this.elems = createRegisterBlock();
    this.id = 'register';
  }
}

class Form{
  constructor (validator, submitRender) {
    this.form = document.querySelector('#form');
    this.blocks = {}
    this.selectedId = ''
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dataObj = {validationType: this.selectedId}
      const inputNL = this.form.querySelectorAll('input')
      inputNL.forEach(item => {
        if (item.attributes.type && item.attributes.type.nodeValue !== 'submit') {
          dataObj[ item.name || 'empty'] = item.value
        }
      })
      //console.log(validator)
      let message = await validator(dataObj)
      await submitRender(message);
    })
  }

  addBlock(block, switchElem) {
    block.setSwitch(switchElem, () => this.chooseBlock(block))
    this.blocks[block.id] = block
    
  }

  chooseBlock(block) {
    const id = block.id
    //console.log(block)
    if (id !== this.selectedId) {
      let block = this.blocks[id]
      this.selectedId = id
      this.form.textContent = ''
      this.form.append(...block.getElems())
      for (let key in this.blocks) {
        if (key !== id) {
          this.blocks[key].setSwitchInactive()
        }
      }
    } 
  }

  changeBlock(newBlock, block) {
    delete this.blocks[block.id]
    this.addBlock(newBlock, block.switch)
  }

}

class LogOutBlock extends FormBlock {
  constructor(){
    super();
    this.elems = createLogOutBlock();
    this.id = 'logout';
  }
}

export default {
  LoginBlock,
  RegisterBlock,
  Form,
  LogOutBlock
}