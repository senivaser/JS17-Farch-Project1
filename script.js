'use strict'

//#region Вспомогательные функции

//Проверка на тип "Число" из потокового ввода
const isNumber = (n) => {
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
  const getDaysInNextMonth = () => {
    return new Date().daysInNextMonth()
  }

//#region valueCheck || Как Check condition, только для проверки переменной

//valueCheck проверяет значение по проверкам во втором аргументе. 
//При первом верном условии, возвращает [false, 'Сообщение для вывода в alert соотв условию']
//При ни одном верном возвращает [true]

const valueCheck = (value, conditions) => {
    
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
    const depBankSelectN = document.querySelector('.deposit-bank')
    const depAmtInputN = document.querySelector('.deposit-amount')
    const depPrcInputN = document.querySelector('.deposit-percent')

    //10.1.0
    let expItemsListN = document.querySelectorAll('.expenses-items')
    let incItemsListN = document.querySelectorAll('.income-items')
    
    moneyInputN.value = '50000'

//#endregion 9.1 pageNodes


//#region appData

class appData {

    constructor() {

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
        this.alert = false;
        this.dispData = new Map()
        this.isLoad = false;

    }

    static controlEntryFunction(){

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
    }
    
    //#region launchers
    reset () {
    
        
    
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
        this.alert = false; 
    
        this.resetDataInputs()
        this.resetExpensesBlocks()
        this.resetIncomeBlocks()
        this.resetResults()
        
        addIncBtnN.style.display = 'block'
        addExpBtnN.style.display = 'block'
        depPrcInputN.style.display = 'none'
    }
    

    start () {

        this.alert = false;
        this.budget = +moneyInputN.value
    
        this.getAccountingData() //getIncome, getExpenses
        this.getMonthStatData() //getExpensesMonth, getIncomeMonth
        this.getOptionsData() //getAddIncome, getAddOutcome
        
        this.getInfoDeposit();
        
        this.getBudjet();
        
        if (!this.alert) {
            this.showResult();    
            this.disableDataInputs();
            this.getDispData()
            this.setValues();
        }
       
        
       
    
    }

    buttonHandle() {
        if (this.isCalculated) {
            this.reset()
        } else {
            this.start()
        }
    }

    //#endregion launchers
    
    
    //#region showMethods
    
    showResult(){

        budMthDispN.value = this.budgetMonth+this.expensesMonth;
        budDayDispN.value = Math.floor(this.budgetDay);
        expMthDispN.value = this.expensesMonth;
        addExpDispN.value = this.addExpenses.join(', ');
        addIncDispN.value = this.addIncome.join(', ');
        tarMthDispN.value = this.getTargetMonth();
        incForPerDispN.value = this.calcSavedMoney();
        
        periodRangeN.addEventListener('input', () => {
    
            incForPerDispN.value = this.calcSavedMoney();
        
        })


              
    }

    resetResults(){

        const dispNL = document.querySelectorAll('[class*="-value"]');
        [...dispNL].forEach(item => {
            item.value = ''
        })


    }
    
    //#endregion showMethods  
    
    
    //#region addMethods
    
    addExpensesBlock() {
        
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
    }
    
    addIncomeBlock() {
    
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
    }
    
    //#endregion addMethods
   
    
    //#region resetInputMethods

    setDataInputs(isEnabled, toClear) {
        const allDataInputNL = document.querySelector('.data').querySelectorAll('input[type=text]');
        [...allDataInputNL].forEach(item => {
            item.disabled = !isEnabled; // Включить/выключить input
            if (toClear) item.value = '' // Очистить/оставить значение
        })
    }
    
    disableDataInputs() {
        this.setDataInputs(false, false) //Выключает и оставляет значение
    }
    
    // enableDataInputs: function() {
    //     setDataInputs(false, true)
    // },
    
    
    resetDataInputs() {
        this.setDataInputs(true, true) //Очищает и включает
    }


    static resetBlocks(blockList) {
        
        [...blockList].forEach((item, index) => {
            if (index === 0) {
                item.childNodes.forEach(item => {
                    if (item.tagName === 'INPUT') item.value = '';
                });
            } else if (item.tagName !== 'BUTTON') {
                item.remove()
            } 
        })
    }

    resetExpensesBlocks() {
        appData.resetBlocks(expItemsListN)
    }

    resetIncomeBlocks() {
        appData.resetBlocks(incItemsListN)
    }

    //#endregion resetInputMethods
    

    //#region getMethods
    
    getAccountingData() {

        const addData = {};
        const fieldNL = [
            ...document.querySelectorAll('.income-items'), 
            ...document.querySelectorAll('.expenses-items')
        ]

        fieldNL.forEach((itemN) => {       
        
            const categoryStr = itemN.className.split('-')[0]
            const labelItem = itemN.querySelector(`.${categoryStr}-title`).value;
            const valueItem = itemN.querySelector(`.${categoryStr}-amount`).value;

            const checkResult = valueCheck(labelItem, 
                [
                    [`Cтатья расходов ${labelItem} повторяется в полях ввода`, 
                        (result) => (Object.keys(addData[categoryStr] || {null: null}).find((target => target === result)))]
                ]
            )

            

            if(checkResult[0]) {
                if (labelItem.trim().length) {
                    if (!addData[categoryStr]) addData[categoryStr] = {}
                    addData[categoryStr][labelItem] = +valueItem;
                }                    
            } else {
                if (!this.alert) {
                    alert(checkResult[1])
                    this.alert = true
                }
            }
    
        })
    
        if (!this.alert) {
            Object.keys(addData).forEach((category) => {
                this[category] = (Object.keys(addData[category])) ? {...addData[category]}: {empty: '0'};
            })
        }
    }    
    
    getMonthStatData() {

        const accDataToStat = {
            expenses: this.expenses,
            income: this.income
        }

        for (let category in accDataToStat) {
            for (let label in this[category]) {
                this[`${category}Month`] += this[`${category}`][label];
            };
        }

    }

       
    getOptionsData() {
        const options = {
            Expenses: (addExpInputN.value) ?  
                addExpInputN.value
                .toLowerCase()
                .split(',')
                .map(item => item.trim()) :  
                [],
            Income: [...addIncInputNL].map(item => item.value)
        }

        for (let category in options) {
            options[category].forEach(item => {
                if (item.trim() !== '') {
                    this[`add${category}`].push(item.trim())
                }
            })
        }
    
    }
    
    getBudjet () {

        const moneyDeposit = this.moneyDeposit * this.percentDeposit / 100
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + moneyDeposit;
        this.budgetDay = this.budgetMonth/getDaysInNextMonth();
    
        return [this.budgetMonth, this.budgetDay]
      
    }    
    
    getTargetMonth () {
    
        return Math.ceil(+tarAmtInputN.value/this.budgetMonth); 
         
    }
    getStatusIncome() {
    
        if (!isNaN(appData.budgetDay)) {
            if (appData.budgetDay >= 0 && appData.budgetDay < 600) return 'К сожалению, ваш уровень дохода ниже среднего';
            else if (appData.budgetDay >= 600 && appData.budgetDay < 1200) return 'К сожалению, ваш уровень дохода ниже среднего';
            else if (appData.budgetDay >= 1200) return 'К сожалению, ваш уровень дохода ниже среднего';
            else return 'К сожалению, ваш уровень дохода ниже среднего';
        }
        else return 'К сожалению, ваш уровень дохода ниже среднего';
      
    }

    getInfoDeposit() {
        if(this.deposit){
            if (+depPrcInputN.value < 0 || +depPrcInputN.value > 100) {
                this.alert = true;
                alert('Проценты на депозите должны иметь значение от 0 до 100!');
            } else {
                this.percentDeposit = depPrcInputN.value
                this.moneyDeposit = depAmtInputN.value
            }
            
        }
    }

    //#endregion getMethods


    //#region internalMethods
    calcSavedMoney() {
        return this.budgetMonth * periodRangeN.value;
    }

    changePercent() {
        const selectValue = this.value;
        if(selectValue === 'other') {
            depPrcInputN.style.display = 'block'
        } else {
            depPrcInputN.value = selectValue
        }

    }


    //#endregion internalMethods

    //#region dispData 
    
    getDispData() {

        this.dispData.clear();

        const dispNL = document.querySelectorAll('[class*="-value"]');

        [...dispNL].forEach(item => {
            this.dispData.set(item.className, item.value)
        })
    }

    setDispData() {

        [...this.dispData].forEach(([key, value]) => {
            const elem = document.getElementsByClassName(key)[0]
            elem.value = value
        })

    }

    static mapToJSON(thisMap) {
        return JSON.stringify([...thisMap])
    }

    static JSONtoMap(jsonStr) {
        return new Map(JSON.parse(jsonStr));
    }

    //#endregion dispData 

    //#region localStorage & cookie

    static getCookie(name) {

        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;

    }

    static setCookie(name, value, options = {}) {

        options = {
          path: '/',
          ...options
        };
      
        if (options.expires instanceof Date) {
          options.expires = options.expires.toUTCString();
        }
      
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
      
        for (let optionKey in options) {
          updatedCookie += "; " + optionKey;
          let optionValue = options[optionKey];
          if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
          }
        }
        
        document.cookie = updatedCookie;
    }

    static deleteCookie(name) {

        appData.setCookie(name, 'toDelete', {
          'max-age': '0'
        })
    }

    static deleteAllCookies() {
        const cookies = document.cookie.split(";");
        
        cookies.forEach(cookie  => {
            const name =  decodeURIComponent(cookie).trim().split('=')[0]

            appData.deleteCookie(name);
        })
    }

    clearAllStorageData() {
        appData.deleteAllCookies();
        localStorage.clear()
        this.isLoad=false
    }

    setValues() {

        this.getDispData()
        localStorage.setItem('dispData', appData.mapToJSON(this.dispData));
        [...this.dispData].forEach(([key, value]) => {
           appData.setCookie(key, value, {['max-age']: 60*60*24*365*100}) 
        })
        appData.setCookie('isLoad', true, {['max-age']: 60*60*24*365*100}) 
        

    }

    async getValues() {

        let deleteTrigger = false
        this.dispData = appData.JSONtoMap(await localStorage.getItem('dispData'));
        [...this.dispData].forEach(([key, value]) => {
            if (appData.getCookie(key) !== value) deleteTrigger = true 
        })
        if (deleteTrigger) {
            this.handleReset();
        }
        this.setDispData()

    }

    //#endregion localStorage & cookie


    //#region handlers

    handleStart () {
        if (moneyInputN.value.trim().length) {
            if (!this.isLoad) {
                this.start() 
            }
            else {

                this.disableDataInputs();                

            }
            if(!this.alert) {
                clcBtnN.setAttribute('style', 'display: none')
                resBtnN.setAttribute('style', 'display: block')
            }
        }
    }

    handleReset () {        
        this.reset()
        this.clearAllStorageData()
        clcBtnN.setAttribute('style', 'display: block')
        resBtnN.setAttribute('style', 'display: none')        
    }

    handlePeriodRange () {
        periodAmountN.innerText = periodRangeN.value
    }

    handleDepositCheck (event) {
        
        if (event.target.checked) {
            depBankSelectN.style.display = 'inline-block';
            depAmtInputN.style.display = 'inline-block';
            
            this.deposit = true
            depBankSelectN.addEventListener('change', this.changePercent)
        
        } else {
            
            depBankSelectN.style.display = 'none';
            depAmtInputN.style.display = 'none';
            depBankSelectN.value = '';
            depAmtInputN.value = '';
            
            this.deposit = false

            depBankSelectN.removeEventListener('change', this.changePercent)
        }
    }

    //#endregion handlers
   
    //#region eventListeners
    async initializeListeners(){

        await this.getValues()
        this.setDispData()
        this.isLoad = appData.getCookie('isLoad')
        if(this.isLoad) this.handleStart();
        
        clcBtnN.addEventListener('click', this.handleStart.bind(this));
        resBtnN.addEventListener('click', this.handleReset.bind(this));
        
        addExpBtnN.addEventListener('click', this.addExpensesBlock);
        addIncBtnN.addEventListener('click', this.addIncomeBlock);
        
        periodRangeN.addEventListener('input', this.handlePeriodRange);

        depCheckN.addEventListener('change', this.handleDepositCheck.bind(this));

        
    }
    //#region eventListeners
    
}
//#endregion appData



//#region other var
const appDataObj = new appData()

appData.controlEntryFunction()

appDataObj.initializeListeners()
//#endregion other var



//#endregion Объект переменных приложения )