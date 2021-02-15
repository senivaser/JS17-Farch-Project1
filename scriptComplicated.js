'use-strict'

//Рандомное число от 0 до 255 (двухразрядных в 16-ричной системе)
const generate2DigitHex = () => {
    const decNumber = Math.floor(Math.random()*256);
    return (decNumber === 256) ? 
        generate2DigitHex():
        decNumber;
}

//Новый цвет в виде массиваиз 3-х чисел (RGB) в десятичной системе
const createNewColor = () => {
    return [
        generate2DigitHex(),
        generate2DigitHex(),
        generate2DigitHex()
    ];
}

//Преобразование цвета из createNewColor в строку hex
const convertToHexColor = (arr) => {
    return arr.reduce((color, item) => color + ((item > 15) ? item.toString(16): '0' + item.toString(16)), '#');
} 


//Определяется цвет надписи по сумме квадратов отклонений RGB от 255
const BlackOrWhite = (colorDec) => {
    
    const whiteRange = colorDec.reduce((sum, item) => sum + (256-item)**2, 0)
    return ( whiteRange > 50000) ? 'white': 'black';

}

const rootN = document.querySelector('#root');
const colorStringN = document.querySelector('.colorString');
const colorButtonN = document.querySelector('.colorButton');
const labelN = document.querySelector('.label');

const render = () => {
    const decColor = createNewColor();
    const color = convertToHexColor(decColor);
    const bORw = BlackOrWhite(decColor);
    
    colorStringN.innerText = `${color}`;
    rootN.setAttribute('style', `background-color: ${color}`);
    colorButtonN.setAttribute('style', `background-color: ${bORw}`);
    colorStringN.setAttribute('style', `color: ${bORw}`);
    labelN.setAttribute('style', `color: ${color}`)    
}

colorButtonN.addEventListener('click', render)

render()