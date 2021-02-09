'use-strict'

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


const getCurrentDay = function() {
    return new Date().getDay();
}

const getCurrentDateObject = function() {
    
    const dateObj = new Date()
    
    const DateFormat1 =  {
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
    }

    const timeFormat1 = {
        hours:'numeric',
        minutes:'numeric',
        seconds:'numeric'
    }

    const DateTimeFormat2 = {
        hours:'2-digit',
        minutes:'2-digit',
        seconds:'2-digit'
    }

    const getFormattedRU = function(dateObj, props) {
        return dateObj.toLocaleString('ru-Ru', props)
    }

    const customFormatDate1 = function(dateObj, props) {
        return getFormattedRU(dateObj, props).capitalize().split('г.').join('года')
    }
    
    const customFormatTime1 = function(dateObj, props){
        const givenTime = getFormattedRU(dateObj, props).split(',')[1]
        const [hours, minutes, seconds] = givenTime.split(':')
        const [hLabel, mLabel, sLabel] = [
            ([11,12,13,14].includes(+hours)) ? 'часов': (hours%10 === 1) ? 'час': ([2,3,4].includes(hours%10)) ? 'часа': 'часов',
            ([11,12,13,14].includes(+minutes)) ? 'минут': (minutes%10 === 1) ? 'минута':  ([2,3,4].includes(minutes%10)) ? 'минуты': 'минут',
            ([11,12,13,14].includes(+seconds)) ? 'секунд': (seconds%10 === 1) ? 'секунда': ([2,3,4].includes(seconds%10)) ? 'секунды': 'секунд',
        ]
        return `${hours} ${hLabel} ${minutes} ${mLabel} ${seconds} ${sLabel}`
    }

    const customFormateDateTime2 = function(dateObj, props){
        return getFormattedRU(dateObj, props).split(', ').join(' - ')
    }   

    const getMs = function(){
        return dateObj.getMilliseconds()
    }

    return {
        Date1:  'Сегодня ' + customFormatDate1(dateObj, DateFormat1) + ', ' + customFormatTime1(dateObj, timeFormat1),
        Date2: customFormateDateTime2(dateObj, DateTimeFormat2),
        Ms: getMs()
    }
}



const currentDay = getCurrentDay();

const root8 = document.getElementById('root8');


//#region 8
const week = [    
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

week.forEach((dayName, numberOfDay) => {
    const bold = ((getCurrentDay()+6)%7 === numberOfDay) ? 'bold': '';
    const italic = (numberOfDay > 4)? 'italic': '';
    const dayNode = document.createElement('div');
    dayNode.setAttribute('class', `day ${bold} ${italic}`);
    dayNode.innerText = dayName;
    root8.appendChild(dayNode);
})
//#endregion 8

const date1N = document.createElement('div')
const date2N = document.createElement('div')
date1N.setAttribute('class', 'date');
date2N.setAttribute('class', 'date')
root9.appendChild(date1N)
root9.appendChild(date2N)

const {Date1, Date2, Ms} = getCurrentDateObject()
let timeout = 1000 - Ms 

setTimeout(() => {
    date1N.innerHTML = Date1
    date2N.innerHTML = Date2    
}, timeout);

setInterval(() => {
    const datePer = getCurrentDateObject()
    date1N.innerHTML = datePer.Date1
    date2N.innerHTML = datePer.Date2        

}, 1000);
