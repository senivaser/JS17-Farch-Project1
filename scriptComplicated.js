'use-strict'

const strModeration = function (str) {
  if (typeof(str) !== 'string') return 'Wrong type of argument';
  const newStr = str.slice(0, 30).split('');
  const newStrReverse = [].concat(newStr).reverse();
  return newStr
  .slice(newStr.findIndex(c => c !== ' '), newStr.length - newStrReverse.findIndex(c => c !== ' '))
  .join('')
  .concat(str.length > 30 ? '...': '')

} 

console.log(strModeration('     Мама  мыла  раму     '))
console.log(strModeration('     Мама мыла раму                            '))
console.log(strModeration('     Мама мыла раму                        12333'))
console.log(strModeration(1))