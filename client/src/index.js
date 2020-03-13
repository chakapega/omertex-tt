const authenticationStatusIndicator = document.querySelector('.authentication-status-indicator');
const signupForm = document.querySelector('.signup-form');
const loginForm = document.querySelector('.login-form');
const logoutButton = document.querySelector('.button_logout');
const setAuthenticationStatus = () => {
  if (localStorage.getItem('userData')) {
    authenticationStatusIndicator.style.backgroundColor = '#008000';
  } else {
    authenticationStatusIndicator.style.backgroundColor = '#ff0000';
  }
};

setAuthenticationStatus();

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

    const { message, userId, token } = data;

    localStorage.setItem('userData', JSON.stringify({ userId, token }));
    setAuthenticationStatus();
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

    const { message, userId, token } = data;

    localStorage.setItem('userData', JSON.stringify({ userId, token }));
    setAuthenticationStatus();
    loginForm.reset();
    alert(message);
  } catch (error) {
    alert(error.message || 'An error occured, please try again');
  }
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('userData');
  setAuthenticationStatus();
});
