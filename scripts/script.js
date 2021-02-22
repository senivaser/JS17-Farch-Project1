window.addEventListener('DOMContentLoaded', () => {
  'use-strict'

  //Timer
  const countTimer = (deadline) => {

    let timerHoursN = document.querySelector('#timer-hours')
    let timerMinutesN = document.querySelector('#timer-minutes')
    let timerSecondsN = document.querySelector('#timer-seconds')
    
    const getTimeRemaining = () => { 
      
      let dateStop = new Date(deadline).getTime()
      let dateNow = new Date().getTime();
      let timeRemaining = new Date(dateStop - dateNow) / 1000
      let seconds = Math.floor(timeRemaining) % 60
      let minutes = Math.floor(timeRemaining / 60) % 60
      let hours = Math.floor(timeRemaining / 3600)
      
      const formatTimeNum = (num) => {
        return (num.toString().split('').length === 1) ?
          ('0'+num): num
      }
      
      return {
        'hours': formatTimeNum(hours), 
        'minutes': formatTimeNum(minutes), 
        'seconds': formatTimeNum(seconds),
        timeRemaining
      }
    }
    

    const updateClock = async () => {

      let timer = getTimeRemaining();
      if (timer.timeRemaining > 0) {
        [timerHoursN.textContent, timerMinutesN.textContent, timerSecondsN.textContent] = 
          [...Object.values(timer)]
      } else {
        [timerHoursN.textContent, timerMinutesN.textContent, timerSecondsN.textContent] = ['00', '00', '00']
        if (interval) clearInterval(interval)
      }


     
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    
  }

  countTimer('01 march 2021')
  
}) 
