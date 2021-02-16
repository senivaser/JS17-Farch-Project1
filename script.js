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
    const resBtnN = document.getElementById('cancel');

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
    
    moneyInputN.value = '50000'

//#endregion 9.1 pageNodes


//#region appData

const appData = function () {
    this.income = {};
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;         
    this.moneyDeposit = 0;           
    this.budget = 0;             
    this.budgetDay = 0;              
    this.budgetMonth = 0;            
    this.expensesMonth = 0;
    this.incomeMonth = 0; 
    
    
}
//#endregion appData

appData.prototype.controlEntryFunction = function(){

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
                if (!e.target.value.match('^[а-яА-Я-_\ \.\,\!\?\№()]*$')) item.value = item.value.slice(0, -1)
            })
        }
    })
},

appData.prototype.setDataInputs = function(isEnabled, toClear) {
    const allDataInputNL = document.querySelector('.data').querySelectorAll('input[type=text]');
    [...allDataInputNL].forEach(item => {
        item.disabled = !isEnabled; // Включить/выключить input
        if (toClear) item.value = '' // Очистить/оставить значение
    })
},

appData.prototype.disableDataInputs = function() {
    this.setDataInputs(false, false) //Выключает и оставляет значение
},

// enableDataInputs: function() {
//     setDataInputs(false, true)
// },


appData.prototype.resetDataInputs = function() {
    this.setDataInputs(true, true) //Очищает и включает
},

appData.prototype.reset = function () {

    

    this.income = {}
    this.addIncome = []
    this.expenses = {}
    this.addExpenses = []
    this.deposit = false
    this.percentDeposit = 0         
    this.moneyDeposit = 0           
    this.budget = 0             
    this.budgetDay = 0              
    this.budgetMonth = 0            
    this.expensesMonth = 0
    this.incomeMonth = 0 
    this.isCalculated = false 

    this.resetDataInputs()

},

//#region start 
appData.prototype.start = function () {

    this.budget = +moneyInputN.value

    this.getExpenses()
    this.getExpensesMonth()
    this.getIncome();
    this.getIncomeMonth();
    this.getAddExpenses();
    this.getAddIncome();
    this.getBudjet();
    this.showResult();

    this.disableDataInputs();
   

},
//#endregion start 

appData.prototype.buttonHandle = function() {
    if (this.isCalculated) {
        this.reset()
    } else {
        this.start()
    }
},

//#region asking 

appData.prototype.asking = function(){

   
    this.deposit = confirm(`Есть ли у вас депозит в банке?`);
    
},
//#endregion asking 

//#region showMethods

appData.prototype.showResult = function(){
    budMthDispN.value = this.budgetMonth;
    budDayDispN.value = Math.floor(this.budgetDay);
    expMthDispN.value = this.expensesMonth;
    addExpDispN.value = this.addExpenses.join(', ');
    addIncDispN.value = this.addIncome.join(', ');
    tarMthDispN.value = this.getTargetMonth();
    incForPerDispN.value = this.calcSavedMoney();

    periodRangeN.addEventListener('input', () => {

        incForPerDispN.value = this.calcSavedMoney();
    
    })

          
},

//#endregion showMethods  

//#region addMethods

appData.prototype.addExpensesBlock = function() {
    
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

appData.prototype.addIncomeBlock = function() {

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

appData.prototype.getExpenses = function() {
    
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

    if (alertTrigger) this.expenses = (Object.keys(addData)) ? {...addData}: {empty: '0'};

},   

appData.prototype.getIncome = function () {

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

    if (alertTrigger) this.income = (Object.keys(addData)) ? {...addData}: {empty: '0'};
    
},

appData.prototype.getExpensesMonth = function () {

    this.expensesMonth = 0;        
    
    for (let label in this.expenses) {
        this.expensesMonth += this.expenses[label];
    };
    
    return this.expensesMonth;
},    

appData.prototype.getIncomeMonth = function () {

    this.incomeMonth = 0;        
    
    for (let label in this.income) {
        this.incomeMonth += this.income[label];
    };
    
    return this.incomeMonth;
},    


appData.prototype.getAddExpenses = function() {

    const addExpenses = addExpInputN.value;

    this.addExpenses = (addExpenses) ?  
        addExpenses
        .toLowerCase()
        .split(',')
        .map(item => item.trim()) :  
        []; 

},

appData.prototype.getAddIncome = function() {

    this.addIncome = []

    addIncInputNL.forEach(item => {
        let itemValue = item.value.trim();
        if (itemValue !== '') {
            this.addIncome.push(itemValue)
        }
    })

},


appData.prototype.getBudjet = function () {

    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = this.budgetMonth/getDaysInNextMonth();

    return [this.budgetMonth, this.budgetDay]
  
},    

appData.prototype.getTargetMonth = function () {

    return Math.ceil(+tarAmtInputN.value/this.budgetMonth); 
     
},
appData.prototype.getStatusIncome = function() {

    if (!isNaN(appData.budgetDay)) {
        if (appData.budgetDay >= 0 && appData.budgetDay < 600) return 'К сожалению, ваш уровень дохода ниже среднего';
        else if (appData.budgetDay >= 600 && appData.budgetDay < 1200) return 'К сожалению, ваш уровень дохода ниже среднего';
        else if (appData.budgetDay >= 1200) return 'К сожалению, ваш уровень дохода ниже среднего';
        else return 'К сожалению, ваш уровень дохода ниже среднего';
    }
    else return 'К сожалению, ваш уровень дохода ниже среднего';
  
},
appData.prototype.calcSavedMoney = function() {
    return this.budgetMonth * periodRangeN.value;
}

appData.prototype.initializeListeners = function(){
    clcBtnN.addEventListener('click', () => {
        if (moneyInputN.value.trim().length) {
            this.start()
            clcBtnN.setAttribute('style', 'display: none')
            resBtnN.setAttribute('style', 'display: block')
        }
       
    })
    
    resBtnN.addEventListener('click', () => {
        this.reset()
        clcBtnN.setAttribute('style', 'display: block')
        resBtnN.setAttribute('style', 'display: none')
    })
    
    addExpBtnN.addEventListener('click', this.addExpensesBlock)
    addIncBtnN.addEventListener('click', this.addIncomeBlock)
    periodRangeN.addEventListener('input', () => {
    
        periodAmountN.innerText = periodRangeN.value
    
    })
}
//#endregion getMethods

//#region other var
const appDataObj = new appData()

appDataObj.controlEntryFunction()

appDataObj.initializeListeners()
//#endregion other var



//#endregion Объект переменных приложения 
