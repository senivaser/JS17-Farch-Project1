'use strict'

//#region Вспомогательные функции

//Проверка на тип "Число" из потокового ввода
function isNumber (n){
    return !isNaN(parseFloat(n)) && isFinite(n);
};

//Строка с большой буквы
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

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

isEmptyPass - если на входе пустая строка, результат ввода считается null

isNullPass - результат ввода null проходит все проверки; 

isExitReturn - если true, то в случае первого правдивого условия из conditions не повторяет
    запрос, а возвращает ["сообщение",  результат ввода]; 

addMessage - доп сообщение для первого запроса


*/

const checkPromt = function (
    message = '', 
    conditions = [],
    isNumPromt = false,
    isEmptyPass = false,
    isNullPass = false,
    isExitReturn = false,
    addMessage = '') {
    
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


        let localConditions = [].concat(conditions);
        let trigger = false;
        let result = prompt(`${message} ${(addMessage !== '') ? `(${addMessage})`: ''}`);           //Ввод
        result = (isEmptyPass) ? (result.trim() === '') ? null: result: result;                     //Изменение результата ввода при флажке isEmptyPass
        result = (result === null) ? null: (isNumPromt) ? +result: result;                          //Изменение результата ввода при флажке isNumPromt

        [trigger, addMessage] = checkConditions(localConditions, trigger, result, addMessage)       //Проверка условий
        
        if (result === null && isNullPass) trigger = false;                                         //Пропуск проверок, если result = null при флажке isNullPass

        if (isExitReturn) {
            result = [addMessage, result];
            trigger = false;
        }                                                                                           //Корректировка результата и пропуск проверок при флажке isExitReturn

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

//#region valueCheck || Как Check condition, только для проверки переменной

//valueCheck проверяет значение по проверкам во втором аргументе. 
//При первом верном условии, возвращает [false, 'Сообщение для вывода в alert соотв условию']
//При ни одном верном возвращает [true]

const valueCheck = function(value, conditions){
    
    const checkResult = Boolean(conditions && conditions[0][1](value));
    
    let trigger = false;
    let message;
    
    if (checkResult) {
        trigger = true;
        message = conditions && conditions[0][0];
    }
    
    conditions && conditions.shift()
    
    return (trigger) ? 
        [false, message]: 
        (!conditions.length) ?
        [true]: 
        valueCheck(value, conditions);
}

////#endregion valueCheck

//#endregion Вспомогательные функции

//#region Объект переменных приложения 

//#region 9.1 pageNodes

    //N is for Nodes
    //NL is for Nodes List

    //9.1.2a
    const clcBtnN = document.getElementById('start');

    //9.1.2b
    const addIncBtnN = document.getElementsByTagName('button')[0];
    const addExpBtnN = document.getElementsByTagName('button')[1];

    //9.1.2c
    const addIncInputNL = document.querySelectorAll('.additional_income-item');

    //9.1.2d
    const [
        budMthDispN,
        budDayDispN,
        expMthDispN,
        addIncDispN,
        addExpDispN,
        incForPerDispN,
        tarMthDispN
    ] = document.querySelectorAll('[class*="-value"]');
    
    //9.1.2e
    const moneyInputN = document.querySelector('.salary-amount');
    const incTtlInputN = document.querySelector('.income-items').querySelector('.income-title');
    const incAmtInputN = document.querySelector('.income-amount');
    const expTtlInputN = document.querySelector('.expenses-items').querySelector('.expenses-title');
    const expAmtInputN = document.querySelector('.expenses-amount');
    const addExpInputN = document.querySelector('.additional_expenses-item');
    const depCheckN = document.querySelector('#deposit-check');
    const tarAmtInputN = document.querySelector('.target-amount');
    const periodRangeN = document.querySelector('.period-select');
    const periodAmountN = document.querySelector('.period-amount');

    //10.1.0
    let expItemsListN = document.querySelectorAll('.expenses-items')
    let incItemsListN = document.querySelectorAll('.income-items')
 

//#endregion 9.1 pageNodes


//#region appData

const appData = {
    income: {},
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,         
    moneyDeposit: 0,           
    budget: 0,             
    budgetDay: 0,              
    budgetMonth: 0,            
    expensesMonth: 0,
    incomeMonth: 0,          
    
    controlEntryFunction: function(){
        const allInputNL = document.getElementsByTagName('input');
        [...allInputNL].forEach(item => {

            if (item.attributes.placeholder 
                && item.attributes.placeholder.nodeValue === "Сумма"
                && (item.getAttribute('listener') !== 'true')) {
                item.addEventListener('input', (e) => {
                    if (!e.target.value.match(/^[0-9]+$/)) item.value = item.value.slice(0, -1)
                })
            }
            if (item.attributes.placeholder 
                && item.attributes.placeholder.nodeValue === "Наименование"
                && (item.getAttribute('listener') !== 'true')) {
                item.addEventListener('input', (e) => {
                    if (!e.target.value.match('^[а-яА-Я-_\ \.\,\!\?\№()\s]*$')) item.value = item.value.slice(0, -1)
                })
            }
        })
    },


    //#region start 
    start: function () {

        
        appData.budget = +moneyInputN.value

        appData.getExpenses()
        appData.getExpensesMonth()
        appData.getIncome();
        appData.getIncomeMonth();
        appData.getAddExpenses();
        appData.getAddIncome();
        appData.getBudjet();
        appData.showResult();
        

    },
    //#endregion start 

    //#region asking 
    
    asking: function(){

       
        appData.deposit = confirm(`Есть ли у вас депозит в банке?`);
        
    },
    //#endregion asking 
    
    //#region showMethods

    showResult: function(){
        budMthDispN.value = appData.budgetMonth;
        budDayDispN.value = Math.floor(appData.budgetDay);
        expMthDispN.value = appData.expensesMonth;
        addExpDispN.value = appData.addExpenses.join(', ');
        addIncDispN.value = appData.addIncome.join(', ');
        tarMthDispN.value = appData.getTargetMonth();
        incForPerDispN.value = appData.calcSavedMoney();

        periodRangeN.addEventListener('input', () => {

            incForPerDispN.value = appData.calcSavedMoney();
        
        })
        
    },

    //#endregion showMethods  

    //#region addMethods

    addExpensesBlock: function() {
        
        const expItemsN = [...expItemsListN].slice(-1)[0];
        
        const newExpItemsN = expItemsN.cloneNode(true);
        
        
        newExpItemsN.childNodes.forEach(item => {
            if (item.tagName === 'INPUT') item.value = '';
            
        });
        
        expItemsN.after(newExpItemsN);

        appData.controlEntryFunction();
        
        expItemsListN = document.querySelectorAll('.expenses-items');
        
        if (expItemsListN.length === 3) {
            addExpBtnN.style.display = 'none'
        };
    },

    addIncomeBlock: function() {

        const incItemsN = [...incItemsListN].slice(-1)[0];
        
        const newIncItemsN = incItemsN.cloneNode(true);
        
        newIncItemsN.childNodes.forEach(item => {
            if (item.tagName === 'INPUT') item.value = '';
        });
        
        incItemsN.after(newIncItemsN);

        appData.controlEntryFunction();
        
        incItemsListN = document.querySelectorAll('.income-items');
        
        if (incItemsListN.length === 3) {
            addIncBtnN.style.display = 'none'
        };
    },
    
    //#endregion addMethods


    //#region getMethods  

    getExpenses: function() {
        
        let alertTrigger = true;

        const addData = {};
        
        expItemsListN = document.querySelectorAll('.expenses-items');
        
        expItemsListN.forEach((itemN) => {
            const labelItem = itemN.querySelector('.expenses-title').value;
            const valueItem = itemN.querySelector('.expenses-amount').value;

            const checkResult = valueCheck(labelItem, 
                [
                    [`Cтатья расходов ${labelItem} повторяется в полях ввода`, 
                        (result) => (Object.keys(addData).find((target => target === result)))]
                ]
            )

            if(checkResult[0]) {
                if (labelItem.trim().length) addData[labelItem] = +valueItem;
            } else {
                if (alertTrigger) {
                    alert(checkResult[1])
                    alertTrigger = false
                }
            }

        })

        if (alertTrigger) appData.expenses = (Object.keys(appData)) ? {...addData}: {empty: '0'};

    },   

    getIncome: function () {

        let alertTrigger = true;

        const addData = {};
        
        incItemsListN = document.querySelectorAll('.income-items');
        
        incItemsListN.forEach((itemN) => {
            const labelItem = itemN.querySelector('.income-title').value;
            const valueItem = itemN.querySelector('.income-amount').value;

            const checkResult = valueCheck(labelItem, 
                [
                    [`Cтатья доходов ${labelItem} повторяется в полях ввода`, 
                        (result) => (Object.keys(addData).find((target => target === result)))]
                ]
            );            

            if(checkResult[0]) {
                if (labelItem.trim().length) addData[labelItem] = +valueItem;
            } else {
                if (alertTrigger) {
                    alert(checkResult[1])
                    alertTrigger = false
                }
            };

        })

        if (alertTrigger) appData.income = (Object.keys(appData)) ? {...addData}: {empty: '0'};
        
    },

    getExpensesMonth: function () {

        appData.expensesMonth = 0;        
        
        for (let label in appData.expenses) {
            appData.expensesMonth += appData.expenses[label];
        };
        
        return appData.expensesMonth;
    },    

    getIncomeMonth: function () {

        appData.incomeMonth = 0;        
        
        for (let label in appData.income) {
            appData.incomeMonth += appData.income[label];
        };
        
        return appData.incomeMonth;
    },    


    getAddExpenses: function() {

        const addExpenses = addExpInputN.value;

        appData.addExpenses = (addExpenses) ?  
            addExpenses
            .toLowerCase()
            .split(',')
            .map(item => item.trim()) :  
            []; 

    },

    getAddIncome: function() {

        appData.addIncome = []

        addIncInputNL.forEach(item => {
            let itemValue = item.value.trim();
            if (itemValue !== '') {
                appData.addIncome.push(itemValue)
            }
        })

    },
    

    getBudjet: function () {

        appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
        appData.budgetDay = appData.budgetMonth/getDaysInNextMonth();
  
        return [appData.budgetMonth, appData.budgetDay]
      
    },    

    getTargetMonth: function () {
  
        return Math.ceil(+tarAmtInputN.value/appData.budgetMonth); 
         
    },
    getStatusIncome: function() {

        if (!isNaN(appData.budgetDay)) {
            if (appData.budgetDay >= 0 && appData.budgetDay < 600) return 'К сожалению, ваш уровень дохода ниже среднего';
            else if (appData.budgetDay >= 600 && appData.budgetDay < 1200) return 'К сожалению, ваш уровень дохода ниже среднего';
            else if (appData.budgetDay >= 1200) return 'К сожалению, ваш уровень дохода ниже среднего';
            else return 'К сожалению, ваш уровень дохода ниже среднего';
        }
        else return 'К сожалению, ваш уровень дохода ниже среднего';
      
    },
    getInfoDeposit: function() {
        if(appData.deposit){
            appData.percentDeposit = checkPromt('Какой годовой процент депозита?',
            [
                ['Ввод не может быть пустым', (result) => (result === null)],
                ['Это не число', (result) => (!isNumber(result))],
                ['Число процентов должно быть 0 до 100', (result) => (result < 0 || result > 100)]
            ],
            true, true);
            appData.moneyDeposit = checkPromt('Какая сумма лежит на депозите?',
            [
                ['Ввод не может быть пустым', (result) => (result === null)],
                ['Это не число', (result) => (!isNumber(result))],
                ['Сумма на депозите не может иметь отрицательное значение', (result) => (result<0)]
            ],
            true, true); 
        }
    },
    calcSavedMoney: function() {
        return appData.budgetMonth * periodRangeN.value;
    }
    //#endregion getMethods
}
//#endregion appData

//#region other var

appData.controlEntryFunction()

clcBtnN.addEventListener('click', () => {
    if (moneyInputN.value.trim().length) {
        appData.start()
    }
})

addExpBtnN.addEventListener('click', appData.addExpensesBlock)
addIncBtnN.addEventListener('click', appData.addIncomeBlock)
periodRangeN.addEventListener('input', () => {

    periodAmountN.innerText = periodRangeN.value

})


//#endregion other var



//#endregion Объект переменных приложения 
