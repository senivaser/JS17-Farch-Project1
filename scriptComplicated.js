///2.2.1
let num = 266219;

//2.2.2

let product = num.toString().split('').reduce((P, c) => P*c, 1);
let product3 = product**3; //2.2.3

console.log('--------2.2---------');
console.log(`Произведение цифр числа ${num} равно  ${product}`); //2.2.2
console.log(`Результат произведения в степени 3 ${product3}`); //2.2.3
console.log(
  `Первые 2 цифры этого числа: `,
  product3.toString().slice(0,2)
); //2.2.4