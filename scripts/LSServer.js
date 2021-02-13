

const getUsers = () => {
  return JSON.parse(localStorage.getItem('users')) || []
}

const getUserByLogin = (login) => {
  const users = getUsers()
  return users.find(user => user.login === login)
}

const pushUser = (userToPush) => {
  const users = getUsers()
  users.push(userToPush)
  localStorage.setItem('users', JSON.stringify(users))
}

const createUser = (dataObj) => {
  const curDate = new Date()
  const userToCreate = {
    login: dataObj.login,
    password: dataObj.password,
    dateCreated: curDate.toLocaleString('ru-Ru'),
    name: dataObj.name,
    surname: dataObj.surname
  }

  pushUser(userToCreate);
  
}

const msg = (message, type) => {
  console.log(type,': ', message)
  return [message, type]
}

const checkRegister = (dataObj) => {
  let message = ['', 'console']
  const userMatch = getUserByLogin(dataObj.login)
  if (userMatch) {
    message = msg('Пользователь с таким login уже существует', 'error')
  } else {
    if (dataObj.password !== dataObj.rePassword) {
      message = msg('Пароли не совпадают', 'error')
    } else {
      createUser(dataObj)
      message = msg('Регистрация успешно завершена', 'pass')
    }
  }
  return message;
}

const checkLogin = (dataObj) => {
  let message = ['', 'console']
  const userMatch = getUserByLogin(dataObj.login)
  if(userMatch && userMatch.password === dataObj.password){
    console.log(userMatch, userMatch.password, dataObj.password)
    message = msg(`${dataObj.login} Login Success`, 'console')
    setLogin(userMatch);
  } else {
    message = msg('Неправильный логин или пароль', 'error')
  }
  return message;
}

const authFalse = {
  isAuth: false,
  user: null,
}

const setLogin = (userMatch) => {
  localStorage.setItem('auth', JSON.stringify(
    {
      isAuth: true,
      user: userMatch.login
    }
  ))
}

const setLogOut = () => {
  localStorage.setItem('auth', JSON.stringify(authFalse))
}

const getAuth = () => {
  return JSON.parse(localStorage.getItem('auth')) || authFalse
}

const getUserData = () => {
  const users = getUsers();
  return users.map(user => ({
    user: user.user,
    dateCreated: user.dateCreated,
    name: user.name,
    surname: user.surname
  })
  )
}

///////////////

const validator = (dataObj) => {
  let message = ['', 'console']
  const auth = getAuth();
  switch (dataObj.validationType) {
    case 'login':
      if (!auth.isAuth) message = checkLogin(dataObj);
      break;
    case 'register':
      message = checkRegister(dataObj);
      break;
    case 'logout':
      if (auth.isAuth) setLogOut();
      message = msg(`${auth.user} Logged out`, 'console')
      break;
    default:
      message = msg('Wrong Validation type', 'console')
  }
  return message
}

const getAuthData = () => {
  const auth = getAuth()
  return {
    auth: auth,
    userData: (auth.isAuth) ? getUserData(): [],
  }
}

export default function server() {
  
  return {
    validator: validator, 
    getAuthData: getAuthData
  }
  
}