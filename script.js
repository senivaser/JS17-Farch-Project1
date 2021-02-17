'use-strict'


const DOMElement = function ({
    selector, height, width, bg, fontsize
}) {

    

    this.selector = selector;
    this.height = height || 'auto';
    this.width = width || 'available';
    this.bg = bg || 'inherit';
    this.fontsize = fontsize || 'inherit'
    this.elem = null
    

}

DOMElement.prototype.createThisElement = function (rootN, innerText = '', toAppend = true /*true-Добавить в конец; false-в начало*/) {
    
    const _this = this;
    const elem = document.createElement('div');
    const selector = _this.selector;
    const typeChar = selector.slice(0,1);
    const name = selector.slice(1, selector.length);
    
    if (selector) {
        if (typeChar === '#') elem.id = name;
        if (typeChar ==='.') elem.classList.add(name);
    }

    elem.style.height = _this.height;
    elem.style.width = _this.width;
    elem.style.background = _this.bg;
    elem.style.fontSize = _this.fontsize;
    elem.innerText = innerText;
    
    if (toAppend) rootN.append(elem)
    else rootN.prepend(elem);

    _this.elem = elem

    if(_this.hasOwnProperty('x') || _this.hasOwnProperty('y')) {
        this.setComputedStyleProperty('position', 'absolute')
    }

    
    return elem;
}

DOMElement.prototype.setComputedStyleProperty = function(property, value) {
    
    const elem = this.elem;
    
    if (elem.style.hasOwnProperty(property) && value) elem.style[property] = value
    else console.log('WrongProp');
    
    return elem.style[property] && null;

}

const MovingDOMElement = function(props, {x, y}){
    
    DOMElement.call(this, props);
    this.x = x || 0 
    this.y = y || 0
    
}

MovingDOMElement.prototype = Object.create(DOMElement.prototype)
MovingDOMElement.prototype.constructor = MovingDOMElement

MovingDOMElement.prototype.renderPosition = function () {
    const elem = this.elem 
    console.log('render', this.x, this.y)
    elem.style.left = `${this.x}px`,
    elem.style.top = `${this.y}px`
}

MovingDOMElement.prototype.move = function(direction, distance) {

    //console.log(direction, distance)
    
    const _this = this
    const thisX = _this.x
    const thisY = _this.y
    const elem = _this.elem
    const width = parseFloat(_this.width)
    const height = parseFloat(_this.height)

    const directions = {
        up: {x: 0, y: -1},
        down: {x: 0, y: 1},
        left: {x: -1, y: 0},
        right: {x: 1, y: 0}
    }
    
    const nextX = thisX + directions[direction].x*distance
    const nextY = thisY + directions[direction].y*distance

    //console.log(nextX, nextY,  document.body.offsetWidth - width, document.body.offsetHeight - height)

    if (elem) {
        _this.x = (nextX < 0)? 0: (nextX > document.body.offsetWidth - width) ? document.body.offsetWidth - width : nextX
        _this.y = (nextY < 0)? 0: (nextY > document.body.offsetHeight - height) ? document.body.offsetHeight - height : nextY
        console.log(this.x, this.y)
    }

    _this.renderPosition()
}

//14.DE.2.1

const movingSquare = new MovingDOMElement(
    {
        selector: '.square',
        bg: 'lightgreen',
        width: '100px',
        height: '100px'
    },
    {
        x:0,
        y:0
    }
);

const startMoving = function(movingElement) {   
    movingElement.createThisElement(document.body, '', false)
    document.addEventListener('keydown', (event) => {
        event.preventDefault()
        console.log(event.keyCode)
        const arrows = {
            '37': 'left',
            '38': 'up',
            '39': 'right',
            '40': 'down'
        }
        console.log(Object.keys(arrows))
        if (Object.keys(arrows).includes(event.keyCode.toString())) {
            //console.log('movement')
            movingElement.move(arrows[event.keyCode], 10)
        }
    })
}


document.body.style.height = '100vh'
document.body.style.width = '100vw'

//14.DE.2.2
document.addEventListener('DOMContentLoaded', () => {
    
    startMoving(movingSquare)

})

