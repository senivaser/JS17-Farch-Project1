'use-strict'

const getCurrentDay = function() {
    return new Date().getDay();
}

const currentDay = getCurrentDay();

const root = document.getElementById('root');

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
    root.appendChild(dayNode);
})


