'use-strict'

///3.2.1
console.log('--------3.1----------')
//Я эту задачу сам себе усложнил, решая ее с коррекцией ввода, 
//потом увидел, что lang принимает 2 значения, но стирать все жалко :)

let lang = prompt('Choose Language (en, ru): ');

let task1a, task1b, task1c;

//3.2.1a
if (lang === 'ru')
  task1a = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
else if (lang === 'en') 
  task1a = ["Monday", "Tuesday", "Wednesday", "Thusrday", "Friday", "Saturady", "Sunday"];
else
  task1a = ['This language does not exist']

console.log('1.a result: ', ...task1a)

//3.2.1b
switch (lang) {
  case ('ru'):
    task1b = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
  break;
  case ('en'):
    task1b = ["Monday", "Tuesday", "Wednesday", "Thusrday", "Friday", "Saturady", "Sunday"];
  break;
  default:
    task1b = ['This language does not exist'] 
}

console.log('1.b result: ', ...task1b)

//3.2.1c
const data = [
  ['ru', ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]],
  ['en', ["Monday", "Tuesday", "Wednesday", "Thusrday", "Friday", "Saturady", "Sunday"]],
  [undefined, ['This language does not exist']]
];

task1c = data.find(item => item[0] === (              //Здесь нам нужно найти элемент по ключу(языку), но если его нет, 
    data.find(target => target[0] === lang) &&        //то по ключу undefined. Для того, чтобы превратить несуществующий ключ
    data.find(target => target[0] === lang)[0]        //в undefined, произведем вложенный поиск по ключу внутри 
    )                                                 //критерия для поиска. Конструкция с условным оператором здесь служит проверкой
  )[1];                                               //на существование элементов у критерия. Если результат undefined,   
                                                      //то это наш ключ, а если нет, то сам критерий должен быть ['lang', [...]][0].
console.log('1.c result: ', ...task1c);                //Предложенная конструкция  
                                                      //в случае data.find(target => target[0] === lang) = undefined 
                                                      //возвращает undefined && (...) что есть undefined.
                                                      //В случае data.find(target => target[0] === lang) = ['lang', [...]] 
                                                      //возвращает ['lang', [...]] && ['lang', [...]][0] что есть ['lang', [...]][0] что есть 'lang'

//3.2.2
console.log('--------3.2----------');

let namePerson = prompt('Enter person name:');

let role = (namePerson === 'Артем') ?
  'директор':
  (namePerson === 'Максим')?
  'преподаватель':
  'студент'

console.log(`${namePerson} - это ${role}`)