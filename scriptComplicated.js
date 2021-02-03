'use-strict'

//5.2.1
const task1 = function(){
    const arr =  ['123123', '123123', '123123', '23232' ,'434234', '2342342', '312313'];
    arr.map(item => {
        if (item.slice(0,1) === '2' || item.slice(0,1) === '4') console.log(item);
    })
}

//5.2.2
const task2 = function(){
    const simpleNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
    for (let i = 0; i < simpleNumbers.length - 1; i++) {
        console.log(simpleNumbers[i],  ` Делители этого числа: 1, ${simpleNumbers[i]}`);
    }
}

task1();
