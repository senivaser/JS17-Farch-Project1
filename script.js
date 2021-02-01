//Инициализация переменных (1.3)
//и присвоение значений (2.1.1)

'use strict'

let money = 10000;
let income = 'freelance';
let addExpenses = 'internet';
let deposit = true; 
let mission = 50000;
let period = 6;

Date.prototype.daysInNextMonth = function() {
  return 32 - new Date(this.getFullYear(), this.getMonth() + 1, 32).getDate();
};


const apprDays = new Date().daysInNextMonth(); //Дней в следующем месяце для расчета (из тех соображений, 
                                              //что бюджет планируется на следующий месяц)



//(2.1.2)
console.log('--------2.1---------');
console.log('Types of variables:');
console.log('money: ', typeof(money));
console.log('income: ', typeof(income));
console.log('deposit: ', typeof(deposit));
console.log('-----------------------');
console.log('Length of addExpences: ', addExpenses.length);
console.log('-----------------------');
console.log(`Период равен ${period} месяцев`);
console.log(`Цель заработать ${mission} рублей`);
console.log('-----------------------');
console.log(addExpenses.toLowerCase().split(''));
console.log('-----------------------');

let budgetDay = 2000;
console.log('Дневной бюджет: ', budgetDay);

console.log('--------3.1---------');
money = prompt('Ваш Месячный доход? (р)'); //3.1.2

addExpenses = prompt(`Перечислите возможные расходы за расчитываемый\
  период через запятую (пример: Квартплата, проездной, кредит)`)
  .split(',')
  .map(item => item.replace(/\s/g, ''));     //3.1.3
  console.log(addExpenses);

deposit = confirm(`Есть ли у вас депозит в банке?`); //3.1.4

//3.1.5
let expenses1 = prompt('Введите обязательную статью расходов (1):');
let amount1 = +prompt(`Во сколько вам обойдется статья расходов \"${expenses1}\"? (р)`);
let expenses2 = prompt('Введите обязательную статью расходов (2):');
let amount2 = +prompt(`Во сколько вам обойдется статья расходов \"${expenses2}\"? (р)`);

let budgetMonth = money - (amount1 + amount2); //3.1.6

//3.1.7
let timeSuccess = (budgetMonth >= 0) ?
  Math.ceil(mission/budgetMonth): 
  'Неопределенное количество';

console.log(`Время достижения цели (${mission} р.): ${timeSuccess} месяцев(-а)`, );
console.log('-----------------------');

//3.1.8
budgetDay = budgetMonth/apprDays;
console.log(`Ваш бюджет на день: ${Math.floor(budgetDay)} р.`);
console.log('-----------------------');

//3.1.9
if (!isNaN(budgetDay)) {
  if (budgetDay >= 0 && budgetDay < 600) console.log('К сожалению, ваш уровень дохода ниже среднего');
  else if (budgetDay >= 600 && budgetDay < 1200) console.log('У вас средний уровень дохода');
  else if (budgetDay >= 1200) console.log('К сожалению, ваш уровень дохода ниже среднего');
  else console.log('Что-то пошло не так');
} 
else console.log('Что-то пошло не так');
console.log('-----------------------');


