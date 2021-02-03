'use strict'

//Инициализация переменных
let money = 10000;
let income = 'freelance';
let addExpenses = 'internet';
let deposit = true; 
let mission = 50000;
let period = 6;
let budgetDay;

//Метод для Date.prototype.
//Возвращает количество дней в следующем месяце для расчета.
//Создан из тех соображений, что бюджет планируется на следующий месяц.
Date.prototype.daysInNextMonth = function() {
  return 32 - new Date(this.getFullYear(), this.getMonth() + 1, 32).getDate();
};

//getter для Date.prototype.daysInNextMonth
const getDaysInNextMonth = function() {
  return new Date().daysInNextMonth()
}

//Ввод входных данных

//5.1.1
const start = function () {
  money = 0;
  do {
    money = +prompt('Ваш месячный доход');
  } while (isNaN(parseFloat(money)));
  
}

start(); //Сорри, что функция не чистая, но так в уроке написано. =( 

//3.1
addExpenses = prompt(`Перечислите возможные расходы за расчитываемый\
  период через запятую (пример: Квартплата, проездной, кредит)`)
  .toLowerCase()
  .split(',')
  .map(item => item.replace(/\s/g, ''));     //3.1.3


deposit = confirm(`Есть ли у вас депозит в банке?`); //3.1.4

//Вспомогательные промты 5.1
const checkNumberPromt = function (message, exception='') {
  let result = 0;
  do {
    if (isNaN(result) || typeof(result) !== 'number') {
      console.log(`Entry is not a number: try again`);
      exception = '(Вы не ввели число. Повторите ввод, пожалуйста)';
    }
    result = +prompt(message + exception);
  } while (isNaN(result) || typeof(result) !== 'number');

  return result;

} 


const checkNaturalPromt = function (message, checkNumberPromt, exception = '') {
   const result = checkNumberPromt(message, exception);
   if (parseFloat(result) < 1) {
     return checkNaturalPromt(message, checkNumberPromt, 'Вы ввели ненатуральное число. Повторите ввод, пожалуйста');
   } else return result;
  
}


//5.1.2
let expenses = []

const getExpensesMonth = function () {
  
  let sum = 0
  const numOfExpenses = checkNaturalPromt('Введите количество статей расхода: ', checkNumberPromt);
  for (let i = 0; i < numOfExpenses; i++) {
    expenses[i] = prompt('Введте обязательную статью расходов'); // тож сорри
    sum += checkNumberPromt('Во сколько это обойдется');
  }
  
  return sum ;

}

let expensesSum = getExpensesMonth();

//4.1.2 reworked 5.1
const getAccumulatedMonth = function (money, expensesSum) {
  
  return money - expensesSum;

}

//4.1.3 reworked 5.1
let accumulatedMonth = getAccumulatedMonth(money, expensesSum);

//4.1.4 reworked 5.1.3
const getTargetMonth = function (mission, accumulatedMonth) {
  
  return Math.ceil(mission/accumulatedMonth); 


}

let targetMonth = getTargetMonth(mission, accumulatedMonth);

//4.1.6
budgetDay = accumulatedMonth/getDaysInNextMonth();

//4.1.7

//Новые Функции 4.1

const showTypeOf = function (data) {
  
  console.log(data, ':', typeof(data));

}

const showStatusIncome = function(budgetDay) {

  if (!isNaN(budgetDay)) {
    if (budgetDay >= 0 && budgetDay < 600) return 'К сожалению, ваш уровень дохода ниже среднего';
    else if (budgetDay >= 600 && budgetDay < 1200) return 'К сожалению, ваш уровень дохода ниже среднего';
    else if (budgetDay >= 1200) return 'К сожалению, ваш уровень дохода ниже среднего';
    else return 'К сожалению, ваш уровень дохода ниже среднего';
  }
  else return 'К сожалению, ваш уровень дохода ниже среднего';

} 

//Вывод

//a
console.log('---showTypeOf---');
showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);
console.log('------');

//b
console.log('---getExpensesMonth---');
console.log(expensesSum);
console.log('------');

//c
console.log('---addExpenses---');
console.log(addExpenses);
console.log('------');

//d 
console.log('---getTargetMonth---');
console.log(`Цель (${mission} р.)\
 ${targetMonth > 0 ? `будет достигнута через ${targetMonth} месяцев(-а)`: 'не будет достигнута'}`);
console.log('------');

//e
console.log('---budgetDay---');
console.log(`Ваш бюджет на день: ${Math.floor(budgetDay)} р.`);
console.log('------');

//e
console.log('---showStatusIncome---');
console.log(showStatusIncome(budgetDay));
console.log('------');