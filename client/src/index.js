const authenticationStatusIndicator = document.querySelector('.authentication-status-indicator');
const formsContainer = document.querySelector('.forms-container');
const signupForm = document.querySelector('.signup-form');
const buttonsContainer = document.querySelector('.buttons-container');
const infoButton = document.querySelector('.button_info');
const loginForm = document.querySelector('.login-form');
const logoutButton = document.querySelector('.button_logout');
const setAuthenticationStatusIndicator = () => {
  if (localStorage.getItem('userData')) {
    authenticationStatusIndicator.style.backgroundColor = '#008000';
  } else {
    authenticationStatusIndicator.style.backgroundColor = '#ff0000';
  }
};
const setVisibilityButtonsContainer = () => {
  if (localStorage.getItem('userData')) {
    buttonsContainer.style.display = 'flex';
  } else {
    buttonsContainer.style.display = 'none';
  }
};
const setVisibilityFormsContainer = () => {
  if (localStorage.getItem('userData')) {
    formsContainer.style.display = 'none';
  } else {
    formsContainer.style.display = 'flex';
  }
};

setAuthenticationStatusIndicator();
setVisibilityFormsContainer();
setVisibilityButtonsContainer();

signupForm.addEventListener('submit', async event => {
  try {
    event.preventDefault();

    const { value: email } = event.target.email;
    const { value: password } = event.target.password;
    const response = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    const { message, token } = data;

    localStorage.setItem('userData', JSON.stringify({ token }));
    setAuthenticationStatusIndicator();
    setVisibilityFormsContainer();
    setVisibilityButtonsContainer();
    signupForm.reset();
    alert(message);
  } catch (error) {
    alert(error.message || 'An error occured, please try again');
  }
});

loginForm.addEventListener('submit', async event => {
  try {
    event.preventDefault();

    const { value: email } = event.target.email;
    const { value: password } = event.target.password;
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    const { message, token } = data;

    localStorage.setItem('userData', JSON.stringify({ token }));
    setAuthenticationStatusIndicator();
    setVisibilityFormsContainer();
    setVisibilityButtonsContainer();
    loginForm.reset();
    alert(message);
  } catch (error) {
    alert(error.message || 'An error occured, please try again');
  }
});

infoButton.addEventListener('click', async () => {
  try {
    const { token } = JSON.parse(localStorage.getItem('userData'));
    const response = await fetch('http://localhost:5000/info', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (response.status === 403) {
      localStorage.removeItem('userData');
      setAuthenticationStatusIndicator();
      setVisibilityFormsContainer();
      setVisibilityButtonsContainer();
    }
    if (!response.ok) throw new Error(data.message);

    const { userId, userIdType, updatedToken } = data;
    localStorage.setItem('userData', JSON.stringify({ token: updatedToken }));

    alert(`userId: ${userId}, userIdType: ${userIdType}`);
  } catch (error) {
    alert(error.message || 'An error occured, please try again');
  }
});

logoutButton.addEventListener('click', () => {
  alert('You are logged out');
  localStorage.removeItem('userData');
  setAuthenticationStatusIndicator();
  setVisibilityFormsContainer();
  setVisibilityButtonsContainer();
});
