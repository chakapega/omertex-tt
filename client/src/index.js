const signupForm = document.querySelector('.signup-form');
const loginForm = document.querySelector('.login-form');

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
    loginForm.reset();
    alert(message);
  } catch (error) {
    alert(error.message || 'An error occured, please try again');
  }
});
