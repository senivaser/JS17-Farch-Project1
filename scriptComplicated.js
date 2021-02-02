'use-strict'

const strModeration = function (str) {
  const newStr = str.slice(0, 30).split('')
  const newStrReverse = [].concat(newStr).reverse()
  if (typeof(str) !== 'string') return 'Wrong type of argument';
  return newStr
  .slice(newStr.findIndex(c => c !== ' '), newStr.length - newStrReverse.findIndex(c => c !== ' '))
  .join('')
  .concat(str.length > 30 ? '...': '')

} 

console.log(strModeration('     Мама  мыла  раму     '))
console.log(strModeration('     Мама мыла раму                            '))
console.log(strModeration('     Мама мыла раму                        12333'))