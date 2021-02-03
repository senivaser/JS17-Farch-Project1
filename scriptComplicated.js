'use-strict'

//5.2.1
const task1 = function(){
    const arr =  ['123123', '123123', '123123', '23232' ,'434234', '2342342', '312313'];
    arr.map(item => {
        if (item.slice(0,1) === '2' || item.slice(0,1) === '4') console.log(item);
    })
}

//5.2.2

const findSimpleNumbers = function (border) {
    let arr = Array.from({length: border}, (e, i) => i + 2);
    for (let i = 2; i < border; i++) {
        if (arr.find((item) => item === i)) {
            arr = arr.filter(item => ((item%i !== 0) || (item === i)))
        }
    }
    return arr
}

const task2 = function(){
    const simpleNumbers = findSimpleNumbers(1000)
    for (let i = 0; i < simpleNumbers.length - 1; i++) {
        console.log(simpleNumbers[i],  ` Делители этого числа: 1, ${simpleNumbers[i]}`);
    }
}

task2();
