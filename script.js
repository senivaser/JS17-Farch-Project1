'use-strict'

///Вспомогательные функции
function isNumber (n){
    return !isNaN(parseFloat(n)) && isFinite(n);
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const checkPromt = function (
    message = '', 
    conditions = {},
    numPromt = false,
    nullPass = true,
    addMessage = '') {
    
    
    
        let trigger = false
        let result = prompt(message + addMessage)
        result = (result === null) ? null: (numPromt) ? +result: result;
        
        for (let label in conditions){
            if (trigger) continue
            else {
                const checkResult = Boolean(conditions[label](result))
                if (checkResult) {
                    trigger = true
                    addMessage = label
                }
            }
        } 
       
        if (result === null && nullPass) trigger = false

        return (trigger) ? checkPromt(message, 
            conditions,
            numPromt,
            nullPass,
            addMessage) :
            result

}
 
///////////////////


const startgame = function (status = '')  {

    let x = getRandomInt(100)
    //console.log(x) ЧИТЫЫЫ!!!!

    y = checkPromt('Угадай число от 1 до 100.', 
        {   
            'Это не число': (result) => !isNumber(result),
            'Загаданное число меньше': (result) => x < result,
            'Загаданное число больше': (result) => x > result,

        })
    
    if (y === null) alert('Игра окончена')
    else alert('Поздравляем, Вы угадали!')

    
}

startgame()