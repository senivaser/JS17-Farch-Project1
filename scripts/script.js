function animate({timing, draw, duration, props, cb = () => {}}) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // вычисление текущего состояния анимации
    let progress = timing(timeFraction);

    draw(progress, props); // отрисовать её

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    } else {
      cb()
    }

  });
}

//#region cubicBezierTiming
function cubicBezierFunction (x1, y1, x2, y2){

	var curveX = function(t){
		var v = 1 - t;
		return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
	};

	var curveY = function(t){
		var v = 1 - t;
		return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
	};

	var derivativeCurveX = function(t){
		var v = 1 - t;
		return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
	};

	return function(t){

		var x = t, t0, t1, t2, x2, d2, i;

		// First try a few iterations of Newton's method -- normally very fast.
		for (t2 = x, i = 0; i < 8; i++){
			x2 = curveX(t2) - x;
			if (Math.abs(x2) < 1/100) return curveY(t2);
			d2 = derivativeCurveX(t2);
			if (Math.abs(d2) < 1e-6) break;
			t2 = t2 - x2 / d2;
		}

		t0 = 0, t1 = 1, t2 = x;

		if (t2 < t0) return curveY(t0);
		if (t2 > t1) return curveY(t1);

		// Fallback to the bisection method for reliability.
		while (t0 < t1){
			x2 = curveX(t2);
			if (Math.abs(x2 - x) < 1/100) return curveY(t2);
			if (x > x2) t0 = t2;
			else t1 = t2;
			t2 = (t1 - t0) * .5 + t0;
		}

		// Failure
		return curveY(t2);

	};

};

function cubicBezierTimingIn (t) {
  return cubicBezierFunction(0.16, 0.62, 0.27, 1)(t)
}

function cubicBezierTimingOut (t) {
  return cubicBezierFunction(0.02, 0, 0.56, 0.33)(t)
}
//#endregion cubicBezierTiming
function drawIn(progress, {elem}) {
  elem.style.transform = `translateY(calc(-100% + ${progress}*(50vh) + ${progress}*50%)`
} 

function drawOut(progress, {elem}) {
  elem.style.transform = `translateY(calc(50vh - 50% - ${progress}*(50vh) - ${progress}*50%))`
} 

function scrollToNextSlide(progress, { mainHeight, currentScroll }) { 
  document.documentElement.scrollTop = `${currentScroll + (mainHeight - currentScroll)*progress}`
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}





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
          [...Object.values(timer)];
      } else {
        [timerHoursN.textContent, timerMinutesN.textContent, timerSecondsN.textContent] = ['00', '00', '00'];
        [timerHoursN.style.color, timerMinutesN.style.color, timerSecondsN.style.color] = ['red', 'red', 'red'];
        if (interval) clearInterval(interval);
      }


     
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    
  }

  countTimer('01 feb 2021');

  const toggleMenu = () => {

    const menuN = document.querySelector('menu');

    const handleMenu = () => {
      menuN.classList.toggle('active-menu')
    }

    document.documentElement.addEventListener('click', (event) => {
      const target = event.target

      if (
        (target.closest('.menu')) ||
        (menuN.classList.contains('active-menu') && !target.closest('menu')) ||
        (target.closest('.close-btn')) ||
        (target.closest('menu>ul>li'))
        )
      {
        handleMenu();
      }

    });

    // btnMenuN.addEventListener('click', handleMenu)

    // closeBtnN.addEventListener('click', handleMenu);

    // [...menuItemsNL].forEach(item => {
    //   item.addEventListener('click', handleMenu)
    // })
  }

  toggleMenu()

  const togglePopUp = () => {
    const popupN = document.querySelector('.popup');
    const popupContentN = document.querySelector('.popup-content')
    const popupBtnNL = document.querySelectorAll('.popup-btn');
    const popupCloseBtnN = document.querySelector('.popup-close');
    popupContentN.style.top = '0';
    popupContentN.style.transform = 'translateY(-100%)';

    const isMobile = () => {
      return (window.innerWidth < 768) ? true: false
    }

    const animateIn = () => {
      if (!isMobile()) {
        animate({
          timing: cubicBezierTimingIn,
          draw: drawIn,
          duration: 1000,
          props: {
           elem: popupContentN
          }
        })
       } else {
        popupContentN.style.transform = 'translateY(calc(50vh - 50%))';
       }       
    }

    const animateOut = () => {
      if (!isMobile()) {
        animate({
          timing: cubicBezierTimingOut,
          draw: drawOut,
          duration: 500,
          props: {
            elem: popupContentN
          },
          cb: () => {popupN.style.display = 'none';}
        })
      } else {
        popupContentN.style.transform = 'translateY(-100%)';
        popupN.style.display = 'none';
      }
    }


    [...popupBtnNL].forEach(elem => {
      elem.addEventListener('click', () => {
       popupN.style.display = 'block';
       animateIn()
      })
    }); 


    popupCloseBtnN.addEventListener('click', () => {
      animateOut()
    });

    popupN.addEventListener('click', (event) => {
      if(!event.target.closest('.popup-content')) {
        animateOut()
      }
    });
  };

    

  togglePopUp();

  scrollHandle = () => {
    const scrollButtonN = document.querySelector('#scrollButton')

    scrollButtonN.addEventListener('click', () => {

      const mainN = document.querySelector('main')
      const mainHeight = mainN.offsetHeight
      const currentScroll = document.documentElement.scrollTop

      animate({
        timing: cubicBezierTimingIn,
        draw: scrollToNextSlide,
        duration: 750,
        props: {
          mainHeight,
          currentScroll
        }
      })
    })
  }

  scrollHandle()

  const tabs = () => {
    const tabHeaderN = document.querySelector('.service-header');
    const tabNL = tabHeaderN.querySelectorAll('.service-header-tab');
    const tabContentNL = document.querySelectorAll('.service-tab');

    const toggleTabContent = (index) => {
      for (let i = 0; i < tabContentNL.length; i++){
        if (index === i){
          tabNL[i].classList.add('active');
          tabContentNL[i].classList.remove('d-none');
        } else {
          tabNL[i].classList.remove('active');
          tabContentNL[i].classList.add('d-none');
        }
      }
    }

    

    tabHeaderN.addEventListener('click', (event) => {

      const target = event.target.closest('.service-header-tab');

        if (target.classList.contains('service-header-tab')){
          tabNL.forEach((item, i) => {
            if(item === target) {
              toggleTabContent(i);              
            }
          })
        }

      
    })
  }

  tabs()

  const slider = () => {
    const slidesNL = document.querySelectorAll('.portfolio-item');
    const btn = document.querySelector('.portfolio-btn');
    const dotsN = document.querySelector('.portfolio-dots');
    const sliderN = document.querySelector('.portfolio-content');

    slidesNL.forEach((elem, index) => {
      const dotN = document.createElement('li')
      dotN.classList.add('dot')
      if (!index) dotN.classList.add('dot-active') 
      dotsN.append(dotN)
    })

    const dotNL = document.querySelectorAll('.dot');

    let currentSlide = 0
    
    const prevSlide = (elemList, index, strClass) => {
      elemList[index].classList.remove(strClass);
    }

    const nextSlide = (elemList, index, strClass) => {
      elemList[index].classList.add(strClass);
    }

    const autoplaySlides = () => {

      prevSlide(slidesNL, currentSlide, 'portfolio-item-active');
      prevSlide(dotNL, currentSlide, 'dot-active')


      if (currentSlide >= slidesNL.length - 1) {
        currentSlide = 0
      } else {
        currentSlide++;
      }

      nextSlide(slidesNL, currentSlide, 'portfolio-item-active');
      nextSlide(dotNL, currentSlide, 'dot-active')


    }

    let interval;

    const startPlaySlides = () => {
      interval = setInterval(autoplaySlides, 2000);
    }

    const stopPlaySlides = () => {
      clearInterval(interval)
    }

    sliderN.addEventListener('click', (event) => {
      
      event.preventDefault();

      const target = event.target

      prevSlide(slidesNL, currentSlide, 'portfolio-item-active');
      prevSlide(dotNL, currentSlide, 'dot-active')

      if (target.matches('#arrow-right')){
        if (currentSlide >= slidesNL.length -1) {
          currentSlide = 0
        } else {
          currentSlide++;
        }        
      } else if (target.matches('#arrow-left')){
        if (currentSlide < 1) {
          currentSlide = slidesNL.length - 1
        } else {
          currentSlide--;
        }     
      } else if (target.matches('.dot')) {
        dotNL.forEach((dot, index) => {
          if (dot === target) currentSlide = index
        })
      }

      nextSlide(slidesNL, currentSlide, 'portfolio-item-active');
      nextSlide(dotNL, currentSlide, 'dot-active')

    })

    sliderN.addEventListener('mouseover', (event) => {
      if (event.target.matches('.portfolio-btn') || event.target.matches('.dot')){
        stopPlaySlides();
      }
    })

    sliderN.addEventListener('mouseout', (event) => {
      if (event.target.matches('.portfolio-btn') || event.target.matches('.dot')){
        startPlaySlides();
      }
    })

    startPlaySlides();
  }

  slider()

  const teamImg = () => {

    const teamN = document.getElementById('command')

    const changeImage = (event) => {
      if (event.target.matches('.command__photo')) {

        const elem = event.target
        const temp = elem.src
        elem.src = elem.dataset.img
        elem.dataset.img = temp

      }      
    }

    teamN.addEventListener('mouseover', changeImage)
    teamN.addEventListener('mouseout', changeImage)
    
  } 

  teamImg()

  const inputControl = () => {

    const inputReg = (data, target, reg) => {
      if (!reg.test(data)) target.value = target.value.slice(0, -1)
    } //Проверка символа в событии input

    const checkReg = (target, regFrom, regTo) => {
      console.log(regFrom, regTo)
      target.value = target.value.replace(regFrom, regTo)
      console.log(target.value)
    } //Проверка строки после blur

    document.documentElement.addEventListener('input', (event) => {

      const target = event.target

      if (target.closest('.calc-item')) { 
        inputReg(event.data, target, /\d/)
      }

      if (target.closest('.form-email')) {
        inputReg(event.data, target, /[a-z@_\.-]/i)
      }

      if (target.closest('.form-phone')) {
        inputReg(event.data, target, /[-()\d]/i)
      }

      if (target.closest('.mess, .form-name, .form2-name')) {
        inputReg(event.data, target, /[а-я\ \-]/i)
      }
    })

    const inputsList = [...document.querySelectorAll('.calc-item, .form-email, .form-phone, .mess, .form-name, .form2-name')]

    inputsList.forEach(item => {
      item.addEventListener('blur', (event) => {
  
        const target = event.target
        checkReg(target, /(^[\ \-]+)/, '')
        checkReg(target, /[\ \-]+$/, '')
        checkReg(target, /\s+/ig, ' ')
        checkReg(target, /-+/ig, '-')

  
        if (target.closest('.calc-item')) {
   
          checkReg(target, /[^\d]/g, '', '')
        }
  
        if (target.closest('.form-email')) {
          checkReg(target, /[^a-z@_\.-]/i, '')
  
        }
  
        if (target.closest('.form-phone')) {
          checkReg(target, /[^-()\d]/i, '')
  
        }
  
        if (target.closest('.mess, .form-name, .form2-name')) {
          checkReg(target, /[^а-я\ \-]/i, '')
        }
  
        if (target.matches('.form-name, .form2-name')) {
          console.log('qq')
          const splitCArr = target.value.match(/[\ \-]/g)
          target.value = target.value.split(/[\ \-]/).map((word, index) => 
          { 
            console.log(word, word.capitalize())
            return  (splitCArr && splitCArr[index]) 
            ? word.capitalize()+splitCArr[index] 
            : word.capitalize()
          }).join('')


            
        }
      })
    })
  }

  inputControl()

}) 
