'use-strict'

const generateOddNumber = function(x, y) {

    [x, y] = [Math.ceil(Math.min(x,y)), Math.floor(Math.max(x,y))];     //Упорядочивание входных данных по возрастанию


    [x, y] = [(x%2 === 0) ? x+1: x, (y%2 === 0) ? y-1: y];  //Границы множества [x;y] теперь нечетные числа
    
    const arr = Array.from({length: (y-x)/2+1}, (e, i) => (x + 2*i));  //Формирование массива нечетных чисел во множестве [x;y]

    const generateIterArea = function (){
        const area = Math.random();
        return (area === 1) ? generateIterArea(): Math.floor(area*arr.length);
    }                                                                         //генерация случайного итератора во множестве 
    const iterArea = generateIterArea();                                      //iA = area*arr.length ∈ [0:arr.length), к каждой области вероятностного 
    const result = arr[iterArea];                                             //пространства iA ∈ [i, i+1), соответствует случайный итератор i.
    console.log(result);                                                      //Поэтому из пространства убирается точка iA = arr.length
                                                                              //Функция перезапускается, если area === 1
}

generateOddNumber(1, 10);
generateOddNumber(0, -100);
generateOddNumber(-7, -3);
generateOddNumber(-100, 100);
generateOddNumber(1, -1);
