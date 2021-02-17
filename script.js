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

    return elem;
}

//14.DE.2.1

const newDOMElement = new DOMElement(
    {
        selector: '.hello-elem',
        bg: 'green',
        fontSize: '2em'
    }
);

const start = function(elem) { 

    elem.createThisElement(document.body, 'hello HTML', false)
}



//14.DE.2.2
document.addEventListener('DOMContentLoaded', () => {

    start(newDOMElement)

})