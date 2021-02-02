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

money = prompt('Ваш Месячный доход? (р)'); //3.1.2

addExpenses = prompt(`Перечислите возможные расходы за расчитываемый\
  период через запятую (пример: Квартплата, проездной, кредит)`)
  .split(',')
  .map(item => item.replace(/\s/g, ''));     //3.1.3


deposit = confirm(`Есть ли у вас депозит в банке?`); //3.1.4

//3.1.5
let expenses1 = prompt('Введите обязательную статью расходов (1):');
let amount1 = +prompt(`Во сколько вам обойдется статья расходов \"${expenses1}\"? (р)`);
let expenses2 = prompt('Введите обязательную статью расходов (2):');
let amount2 = +prompt(`Во сколько вам обойдется статья расходов \"${expenses2}\"? (р)`);

let expenses = {
  expenses1: amount1,
  expenses2: amount2
}

//4.1.1
const getExpensesMonth = function (amount1, amount2) {
  
  return amount1 + amount2;

}


//4.1.2
const getAccumulatedMonth = function (money, amount1, amount2, getExpensesMonthFunction) {
  
  return money - getExpensesMonthFunction(amount1, amount2);

}

//4.1.3
let accumulatedMonth = getAccumulatedMonth(money, amount1, amount2, getExpensesMonth);

//4.1.4
const getTargetMonth = function (mission, accumulatedMonth) {
  
  return (accumulatedMonth >= 0) ?
    Math.ceil(mission/accumulatedMonth): 
    'Неопределенное количество';

}

//4.1.6
budgetDay = accumulatedMonth/getDaysInNextMonth();

//4.1.7

//Новые Функции

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
showTypeOf('money', money);
showTypeOf('income', income);
showTypeOf('deposit', deposit);
console.log('------');

//b
console.log('---getExpensesMonth---');
console.log(getExpensesMonth());
console.log('------');

//c
console.log('---addExpences---');
console.log(addExpenses);
console.log('------');

//d
console.log('---getTargetMonth---');
console.log(`Время достижения цели (${mission} р.): ${getTargetMonth()} месяцев(-а)`, );
console.log('------');

//e
console.log('---budgetDay---');
console.log(`Ваш бюджет на день: ${Math.floor(budgetDay)} р.`);
console.log('------');

//e
console.log('---showStatusIncome---');
console.log(showStatusIncome());
console.log('------');