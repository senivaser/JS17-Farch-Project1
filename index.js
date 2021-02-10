'use-strict'

//10.1.2a
const booksList = document.querySelector('.books');
const booksInitial = document.querySelectorAll('.book');
booksList.prepend(booksInitial[1]);
booksList.append(booksInitial[2]);
booksInitial[3].before(booksInitial[4]);

//10.1.2b
const body = document.body;
body.setAttribute('style', 'background-image: url(./image/you-dont-know-js.jpg);');

//10.1.2c
const booksCurrent = booksList.querySelectorAll('.book');
const book3 = booksCurrent[2];
const label3 = book3.querySelector('h2 > a');
label3.innerText = "Книга 3. this и Прототипы Объектов";

//10.1.2d
document.querySelector('.adv').remove();

//10.1.2e

//Вспомогательные функции
const sortNodesBy = function(nodeList, sortFunction) {
  return [...nodeList].sort(sortFunction)
};

const filterNodesBy = function(nodeList, filterFunction) {
  return [...nodeList].filter(filterFunction)
};

const getChapterNumber = function(node){
  return +(node.innerText).split(' ')[1].slice(0,-1)
};

//Выделение нужных книг
const brokenChaptersBooks = [booksCurrent[1], booksCurrent[4]];

//Сортировка глав
brokenChaptersBooks.forEach(book => {
  //Список подпунктов
  const lilist = book.querySelector('ul').querySelectorAll('li')
  
  //Список глав по изначальной очереди
  const chapterList = filterNodesBy(lilist, (node) => (node.innerText.includes('Глава')));
  
  //Сортированный список глав
  const orderedChapterList = sortNodesBy(chapterList, (a, b) => getChapterNumber(a) - getChapterNumber(b));
  
  //Первый элемент из отсортированного списка должен встать перед изначально первым элементом
  //Все последующие должны встать за предыдущими по отсортированному списку 
  orderedChapterList.forEach((node, number) => {
    if (number === 0) {
      chapterList[0].before(node)
    }
    else {
      orderedChapterList[number-1].after(node)
      }
  });

})

//10.1.2f
  filterNodesBy(
    booksCurrent[5].querySelector('ul').querySelectorAll('li'), 
    (node) => (node.innerText.includes('Глава')))
    .slice(-1)[0]
    .insertAdjacentHTML(
        'afterend',
        '<li>Глава 8: За пределами ES6</li>'
    )
