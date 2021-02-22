String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}


const getCurrentDay = function() {
  return new Date().getDay();
}

const getCurrentDateObject = function() {
  
  const dateObj = new Date();
  
  const DateTimeFormat = {
      hours:'2-digit',
      minutes:'2-digit',
      seconds:'2-digit'
  };

  const WeekDayFormat = {
    weekday: 'long'
  }

  const getFormattedRU = function(dateObj, props) {
      return dateObj.toLocaleString('ru-Ru', props);
  }

  const getFormattedUS = function(dateObj, props) {
    return dateObj.toLocaleString('en-US', props);
  }

  const customFormatTime = function(dateObj, props) {
      return getFormattedUS(dateObj, props).split(', ')[1];
  }

  const getDayGreetings = function(dateObj) {

    const makeSixHoursArray = function(start) {
      return Array.from([0,1,2,3,4,5], i => start+i);
    }
    
    const greetingsObj = {
      "Доброй ночи!": makeSixHoursArray(0),
      "Доброе утро!": makeSixHoursArray(6),
      "Добрый день!": makeSixHoursArray(12),
      "Добрый вечер!": makeSixHoursArray(18)
    };

    let greetings = 'Доброго времени суток!';

    for (let key in greetingsObj) {
      if (greetingsObj[key].includes(dateObj.getHours())) {
        greetings = key;
      }
    }

    return greetings
  } 
  
  const getDaysToNewYear = function(dateObj) {
    const dateStop = new Date('1 january 2022').getTime()
    const dateNow = new Date().getTime();
    const timeRemaining = dateStop - dateNow;
    return Math.ceil(timeRemaining/1000/3600/24)
  }

  const getMs = function(){
      return dateObj.getMilliseconds();
  }

  return {
      weekday: getFormattedRU(dateObj, WeekDayFormat).capitalize(),
      time: customFormatTime(dateObj, DateTimeFormat),
      greetings: getDayGreetings(dateObj),
      toNewYear: getDaysToNewYear(dateObj)
  }
}


const {weekday, time, greetings, toNewYear} = getCurrentDateObject();


const rootN = document.getElementById('root')

rootN.insertAdjacentHTML('afterbegin', 
  `
    <p>${greetings}</p>
    <p>Сегодня: ${weekday}</p>
    <p>Текущее время: ${time}</p>
    <p>До нового года осталось ${toNewYear} дней</p>
  `
)