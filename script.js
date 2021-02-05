'use-strict'

///Вспомогательные функции
function isNumber (n){
    return !isNaN(parseFloat(n)) && isFinite(n);
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const checkConditions = function(conditions, trigger, result, addMessage){
    const checkResult = Boolean(conditions && conditions[0][1](result))
    if (checkResult) {
        trigger = true
        addMessage = conditions && conditions[0][0]
    }
    conditions && conditions.shift()
    return (trigger || !conditions.length) ? [trigger, addMessage]: checkConditions(conditions, trigger, result, addMessage)
}

const checkPromt = function (
    message = '', 
    conditions = {},
    exitReturn = false,
    numPromt = false,
    nullPass = true,
    addMessage = '') {
    
    
    
        let trigger = false
        let result = prompt(message + addMessage)
        result = (result === null) ? null: (numPromt) ? +result: result;
        
         
        [trigger, addMessage] = checkConditions(conditions, trigger, result, addMessage)
       
        if (result === null && nullPass) trigger = false
        if (exitReturn) {
            result = [addMessage, result]
            trigger = false
        }

        return (trigger) ? checkPromt(message, 
            conditions,
            numPromt,
            nullPass,
            addMessage) :
            result

}
 
///////////////////


const startgame = function (x = getRandomInt(100), countDownNumber = 10, message = '')  {

    console.log(x) //ЧИТЫЫЫ!!!!
    if (countDownNumber === 0) {

        if (confirm('У вас закончились попытки. Начать играть заново?')) {
            startgame()
        }

        else {
            alert('Игра окончена')
            return null
        }

    }

    const y = checkPromt(`Угадай число от 1 до 100. ${message} Осталось попыток: ${countDownNumber}`, 
        [   
            [' (Это не число)', (result) => !isNumber(result)],
            [' (Загаданное число меньше)', (result) => x < result],
            [' (Загаданное число больше)', (result) => x > result],

        ], true, true)
    
    if (y[1] !== x) {

        console.log(y[1], y[1] === 'null')

        if (y[1] === null) {
            alert('Игра окончена')
            return null
        }

        countDownNumber--
        startgame(x, countDownNumber, y[0])
    }
   
    else if (confirm('Поздравляем, Вы угадали! Попробуете еще раз?')) startgame()
    else {
        alert('Игра окончена')
        return null
    }
    
}

startgame()