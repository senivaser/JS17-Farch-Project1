'use strict'

//#region Вспомогательные функции

//Проверка на тип "Число" из потокового ввода
function isNumber (n){
    return !isNaN(parseFloat(n)) && isFinite(n);
};

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

//#region checkPromt

/* 

                    checkPromt() - расширенный promt

Возвращает результат корректного ввода, если иного не подразумевают аргументы.

Может вызываться с различными аргументами в порядке очереди:

message - основное сообщение; 

conditions - определяет корректность ввода, является упорядоченным списком из элементов 
    ["сообщение", условие вида (результат ввода)=> (условие(результат ввода))], в случае 
    правдивого условия повторяет запрос с доп выводом "сообщения";

isNumPromt - если true, то promt работает как +promt, однако значение null не изменяется; 

isNullPass - результат ввода null проходит все проверки; 

isEmptyPass - если на входе пустая строка, результат ввода считается null

isExitReturn - если true, то в случае первого правдивого условия из conditions не повторяет
    запрос, а возвращает ["сообщение",  результат ввода]; 

addMessage - доп сообщение для первого запроса


*/

const checkConditions = function(conditions, trigger, result, addMessage){
    const checkResult = Boolean(conditions && conditions[0][1](result));
    
    if (checkResult) {
        trigger = true;
        addMessage = conditions && conditions[0][0];
    }
    
    conditions && conditions.shift()
    
    return (trigger || !conditions.length) ? 
        [trigger, addMessage]: 
        checkConditions(conditions, trigger, result, addMessage);
}

const checkPromt = function (
    message = '', 
    conditions = [],
    isNumPromt = false,
    isEmptyPass = false,
    isNullPass = false,
    isExitReturn = false,
    addMessage = '') {
    
    
        let localConditions = [].concat(conditions);
        let trigger = false;
        let result = prompt(`${message} ${(addMessage !== '') ? `(${addMessage})`: ''}`);
        result = (isEmptyPass) ? (result.trim() === '') ? null: result: result;
        result = (result === null) ? null: (isNumPromt) ? +result: result;

        [trigger, addMessage] = checkConditions(localConditions, trigger, result, addMessage)
        
        if (result === null && isNullPass) trigger = false;

        if (isExitReturn) {
            result = [addMessage, result];
            trigger = false;
        }

        return (trigger) ? checkPromt(message, 
            conditions,
            isNumPromt,
            isEmptyPass,
            isNullPass,
            isExitReturn,
            addMessage) :
            result

}

//#endregion checkPromt

//#endregion Вспомогательные функции


//#region Основная программа

//Старт программы. Ввод дохода за месяц
let money;

const start = function () {
    money = 0;
    do {
        money = +prompt('Ваш месячный доход');
    } while (!isNumber(money));
    
}

start(); 


//Объект переменных приложения 
const appData = {
    income: {},
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    mission: 50000,
    period: 3,
    budget: money,             //7.1.2
    budgetDay: 0,              //7.1.3
    budgetMonth: 0,            //7.1.3
    expensesMonth: 0,          //7.1.3
    asking: function(){
        
        let addExpenses = prompt(`Перечислите возможные расходы за расчитываемый\
        период через запятую (пример: Квартплата, проездной, кредит)`)

        appData.addExpenses = (addExpenses) ?  
            addExpenses
            .toLowerCase()
            .split(',')
            .map(item => item.trim()) :
            []; 

        appData.deposit = confirm(`Есть ли у вас депозит в банке?`);
        
    },

    //#region 7.1.4 getMethods

    //7.1.8
    getExpensesMonth: function () {

        appData.expensesMonth = 0;
        
        const numOfExpenses = checkPromt('Введите количество статей расхода: ',
            [
                ['Ввод не может быть пустым', (result) => (result === null)],
                ['Это не число', (result) => (!isNumber(result))],
                ['Число не натуральное. Повторите ввод', (result) => (!(Number.isInteger(result) && result > 0))]
            ],
            true, true            
            );
        
        for (let i = 0; i < numOfExpenses; i++) {

            let expenseLabel = checkPromt(`Введите обязательную статью расходов (${i+1})`,
            [
                ['Ввод не может быть пустым', (result) => (result === null)],
                ['Данная статья расходов уже присутствует в списке', 
                    (result) => (Object.keys(appData.expenses).find((target => target === result)))]
            ],
            false, true
            );

            let expenseValue = checkPromt(`Во сколько это обойдется`,
            [   
                ['Ввод не может быть пустым', (result) => (result === null)],
                ['Это не число', (result) => (!isNumber(result))],
                ['Расходы не могут иметь отрицательное значение', (result) => (result<0)]
            ],
            true, true            
            );
            
            appData.expenses = {...appData.expenses, [expenseLabel]: expenseValue};
        }
        
        for (let label in appData.expenses) {
            appData.expensesMonth += appData.expenses[label]
        }
        
        return appData.expensesMonth
    },    
    
    //7.1.9
    getBudjet: function () {

        appData.budgetMonth = appData.budget - appData.expensesMonth;
        appData.budgetDay = appData.budgetMonth/getDaysInNextMonth();
  
        return [appData.budgetMonth, appData.budgetDay]
      
    },    
    
    //7.1.10
    getTargetMonth: function () {
  
        return Math.ceil(appData.mission/appData.budgetMonth); 
         
    },
    getStatusIncome: function() {

        if (!isNaN(appData.budgetDay)) {
            if (appData.budgetDay >= 0 && appData.budgetDay < 600) return 'К сожалению, ваш уровень дохода ниже среднего';
            else if (appData.budgetDay >= 600 && appData.budgetDay < 1200) return 'К сожалению, ваш уровень дохода ниже среднего';
            else if (appData.budgetDay >= 1200) return 'К сожалению, ваш уровень дохода ниже среднего';
            else return 'К сожалению, ваш уровень дохода ниже среднего';
        }
        else return 'К сожалению, ваш уровень дохода ниже среднего';
      
    }
    //#endregion 7.1.4
}
//#region 7.1.6 Вызов функции ввода данных
appData.asking()   
//#region 7.1.6

//#region 7.1.5 || 7.1.11 Вызов функций изменения appData
appData.getExpensesMonth()

appData.getBudjet();

let targetMonth = appData.getTargetMonth();

let statusIncome = appData.getStatusIncome()
//#endregion 7.1.5 || 7.1.11

//#endregion Основная программа


//#region 7.1.12 || 7.1.13 Вывод 

//7.1.12
//a
console.log('---getExpensesMonth---');
console.log(appData.expensesMonth, appData.expenses);
appData.expenses
console.log('------');

//b 
console.log('---getTargetMonth---');
console.log(`Цель (${appData.mission} р.)\
 ${targetMonth > 0 ? `будет достигнута через ${targetMonth} месяцев(-а)`: 'не будет достигнута'}`);
console.log('------');

//c
console.log('---showStatusIncome---');
console.log(statusIncome);
console.log('------');

//7.1.13
console.log("Наша программа включает в себя данные: ")
for (let property in appData) {
    console.log(property)
}

//#endregion 7.1.12  Вывод